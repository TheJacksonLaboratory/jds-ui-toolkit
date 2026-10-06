#!/usr/bin/env node
/**
 * Render the ancestor tree a term browser would draw, using the real buildTermTree.
 *
 * Usage:
 *   node tools/term-tree-preview.mjs HP:0001166
 *   node tools/term-tree-preview.mjs HP:0001166 --root http://localhost:8081/api
 *   node tools/term-tree-preview.mjs MP:0002169 --max 60
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SOURCE = 'libs/api-clients/src/lib/services/ontology/ontology.tree.ts';

const args = process.argv.slice(2);
const FLAGS = ['root', 'max'];
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const positional = args.filter((a, i) => !a.startsWith('--') && !FLAGS.includes(args[i - 1]?.replace('--', '')));
const id = positional[0] ?? 'HP:0001166';
const root = flag('root', 'https://ontology.jax.org/api').replace(/\/+$/, '');
const maxNodes = Number(flag('max', 500));

// buildTermTree is pure, but it ships in a bundle that pulls in Angular DI, so compile it alone.
const out = mkdtempSync(join(tmpdir(), 'termtree-'));
execFileSync('node_modules/.bin/tsc', [SOURCE, '--outDir', out, '--module', 'esnext',
  '--moduleResolution', 'bundler', '--target', 'es2022'], { stdio: 'inherit' });
const { buildTermTree } = await import(`file://${resolve(out, 'ontology.tree.js')}`);

const base = `${root}/${id.split(':')[0].toLowerCase()}`;
const get = async url => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
};

console.log(`\nterm    ${id}`);
console.log(`backend ${base}\n`);

const focus = await get(`${base}/terms/${encodeURIComponent(id)}`);
let ancestors = await get(`${base}/terms/${encodeURIComponent(id)}/ancestors`);

// Deployments predating the parents field answer with a flat set carrying no edges.
if (ancestors.length && ancestors.every(t => t.parents === undefined)) {
  console.log(`!  this deployment does not send "parents" yet — reconstructing the edges`);
  console.log(`   with ${ancestors.length} extra /parents calls so the preview still works\n`);
  const edges = await Promise.all(ancestors.map(async t =>
    [t.id, (await get(`${base}/terms/${encodeURIComponent(t.id)}/parents`)).map(p => p.id).sort()]));
  const byId = Object.fromEntries(edges);
  ancestors = ancestors.map(t => ({ ...t, parents: byId[t.id] }));
}

const tree = buildTermTree(focus, ancestors, { maxNodes });

const draw = (nodes, indent = '') =>
  nodes.forEach((n, i) => {
    const last = i === nodes.length - 1;
    console.log(`${indent}${last ? '└─ ' : '├─ '}${n.term.name}${n.isFocus ? '   ◀ FOCUS' : ''}`);
    draw(n.children, indent + (last ? '   ' : '│  '));
  });
draw(tree.roots);

console.log(`\nancestors in    ${ancestors.length}`);
console.log(`distinct terms  ${new Set([...ancestors.map(t => t.id), focus.id]).size}`);
console.log(`rendered rows   ${tree.nodeCount}`);
console.log(`paths to focus  ${tree.pathCount}`);
console.log(`truncated       ${tree.truncated}`);
if (tree.unresolved.length) console.log(`unresolved      ${tree.unresolved.join(', ')}`);
