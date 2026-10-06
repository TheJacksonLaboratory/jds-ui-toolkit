import { OntologyTerm } from './ontology.model';

/**
 * A term at one position in the tree.
 *
 * An ontology is a directed acyclic graph, so one term can occupy many positions. A node is
 * identified by its {@link path}, never by its term id: two positions are the same node only
 * when their entire path from the root is identical.
 */
export interface TermTreeNode {
  /** The term occupying this position. */
  term: OntologyTerm;
  /** Ids from the root down to and including this node. */
  path: string[];
  /** Stable identity of the position, for expansion state. */
  key: string;
  /** Positions directly below this one. */
  children: TermTreeNode[];
  /** Whether this position holds the term the tree was built for. */
  isFocus: boolean;
}

/** A tree of ancestor positions, and what was left out of it. */
export interface TermTree {
  /** Positions with no parent, ordered by term name. */
  roots: TermTreeNode[];
  /** Positions holding the focus term, one per distinct root path. */
  pathCount: number;
  /** Positions in the tree, which exceeds the number of distinct terms. */
  nodeCount: number;
  /** Whether `maxNodes` stopped the walk before the whole tree was rendered. */
  truncated: boolean;
  /** Parent ids naming a term that was not supplied, in encounter order. */
  unresolved: string[];
}

/** Options accepted by {@link buildTermTree}. */
export interface TermTreeOptions {
  /** Positions to render before stopping. Defaults to 500. */
  maxNodes?: number;
}

const SEPARATOR = '>';

/**
 * Arrange a term's ancestors into the tree of positions they occupy.
 *
 * The focus term is rendered as a leaf at every position it occupies, because its children are
 * loaded separately on expansion. It is attached below every ancestor that has no child among
 * the ancestors, which is what makes such an ancestor a direct parent of it. Siblings are
 * ordered by name.
 * @param focus - the term the tree is built for
 * @param ancestors - the ancestors of the focus term, each populating `parents`
 * @param options - see {@link TermTreeOptions}
 * @returns the tree, and the parent ids it could not resolve
 */
export function buildTermTree(
  focus: OntologyTerm,
  ancestors: OntologyTerm[],
  options: TermTreeOptions = {}
): TermTree {
  const maxNodes = options.maxNodes ?? 500;
  const byId = new Map(ancestors.map(term => [term.id, term]));
  byId.set(focus.id, focus);

  const unresolved: string[] = [];
  const childrenOf = new Map<string, string[]>();
  const rootIds: string[] = [];

  for (const term of ancestors) {
    const parents = (term.parents ?? []).filter(parent => {
      if (byId.has(parent)) {
        return true;
      }
      if (!unresolved.includes(parent)) {
        unresolved.push(parent);
      }
      return false;
    });
    if (parents.length === 0) {
      rootIds.push(term.id);
    }
    for (const parent of parents) {
      childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), term.id]);
    }
  }

  // An ancestor with no child among the ancestors reaches the focus term directly.
  for (const term of ancestors) {
    if (!childrenOf.has(term.id)) {
      childrenOf.set(term.id, [focus.id]);
    }
  }
  if (ancestors.length === 0) {
    rootIds.push(focus.id);
  }

  const name = (id: string) => byId.get(id)?.name ?? id;
  const byName = (a: string, b: string) => name(a).localeCompare(name(b));

  let nodeCount = 0;
  let pathCount = 0;
  let truncated = false;

  const walk = (id: string, prefix: string[]): TermTreeNode | undefined => {
    if (prefix.includes(id)) {
      return undefined;
    }
    if (nodeCount >= maxNodes) {
      truncated = true;
      return undefined;
    }
    nodeCount++;

    const path = [...prefix, id];
    const isFocus = id === focus.id;
    if (isFocus) {
      pathCount++;
    }

    return {
      term: byId.get(id) ?? { id, name: id },
      path,
      key: path.join(SEPARATOR),
      children: isFocus
        ? []
        : [...(childrenOf.get(id) ?? [])]
            .sort(byName)
            .map(child => walk(child, path))
            .filter((child): child is TermTreeNode => child !== undefined),
      isFocus
    };
  };

  const roots = [...rootIds]
    .sort(byName)
    .map(id => walk(id, []))
    .filter((root): root is TermTreeNode => root !== undefined);

  return { roots, pathCount, nodeCount, truncated, unresolved };
}
