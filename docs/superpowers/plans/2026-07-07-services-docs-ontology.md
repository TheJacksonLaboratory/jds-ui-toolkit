# Services Docs Section (Ontology) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a generation-driven "Services" docs section in `apps/demo`, proven out on the `ontology` service (two live implementations: `JaxOntologyService`, `OLSOntologyService`), per `docs/superpowers/specs/2026-07-07-services-docs-design.md`.

**Architecture:** Approach C from the spec — a new `services-shell`, structurally parallel to the existing `docs-shell`, reusing the tab-content components that are already domain-agnostic (`DocOverviewComponent`, `DocUsageComponent`, `DocActivityComponent`) and forking the ones that are genuinely different (tabs, right TOC, and a new Methods tab replacing Properties). A small, additive `DocBase` interface is extracted so the shared `DocsContextService`/reused components can serve either `ComponentDoc` or `ServiceDoc` without becoming component-specific.

**Tech Stack:** Angular (standalone components), PrimeNG, Nx, Jest, Compodoc (new `docs:methods` generator, parallel to `docs:properties`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-07-services-docs-design.md`. Every task below implements one section of it.
- Scope: `ontology` only. `isa-data`'s legacy page, `snp-grid`, `mvar`, and the broken `phenotype` nav placeholder are untouched.
- No Theming tab for services — `ServiceDoc` has no `theming` field at all.
- `ServiceDoc.usageExamples` generalizes N-implementations-per-service as N examples; no separate `implementations` field.
- Methods tab is generation-driven from Compodoc, same principle as Properties: never hand-maintain what JSDoc already states.
- Verified Compodoc JSON shape for `libs/api-clients` (confirmed by running `npx compodoc -p libs/api-clients/tsconfig.lib.json -e json -d <tmp> --silent` and inspecting `documentation.json`): plain abstract classes (no `@Injectable`) are categorized under `doc.classes`; `@Injectable` services are under `doc.injectables`. Both use the method-list key `methods` (not `methodsClass` — that key doesn't exist in this Compodoc version's output), where each entry has `name`, `args: [{name, type}]`, `returnType`, `description` (HTML-rendered summary), `jsdoctags` (per-`@param` HTML comments).

---

## Task 1: Widen shared docs infrastructure for multi-domain reuse

**Files:**
- Modify: `libs/components/src/lib/docs/docs.model.ts`
- Modify: `apps/demo/src/app/docs-shell/docs-context.service.ts`
- Test: `apps/demo/src/app/docs-shell/docs-context.service.spec.ts` (existing — verify it still passes)

**Interfaces:**
- Produces: `DocBase` interface (name, slug, status, tags, isAuthRequired, contact, description, docsUrl?, usage, activity?) — consumed by Task 3's `ServiceDoc` and by the widened `DocsContextService`.

This is a small, additive change to already-shipped code: `ComponentDoc` keeps every field it has today, it just now also satisfies a new shared base type. `DocOverviewComponent`/`DocUsageComponent`/`DocActivityComponent` (used by both the existing Components pages and the new Services pages) read from `DocsContextService.currentDoc()`, so that service's signal type must widen from `ComponentDoc | null` to `DocBase | null` for the Services shell to be able to set it too.

- [ ] **Step 1: Extract `DocBase` in `docs.model.ts`**

Current file (`libs/components/src/lib/docs/docs.model.ts`) starts:

```ts
export type ComponentCategory =
  | 'Navigation'
  | 'Input'
  | 'Messaging'
  | 'Data Display'
  | 'Utilities';

/**
 * Front-matter for a documented component.
 * ...
 */
export interface ComponentDoc {
  name: string;
  slug: string;
  category: ComponentCategory;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  /** Short description shown on the Overview header card. */
  description: string;
  docsUrl?: string;
  /** Class name Compodoc keys the generated Properties table by. */
  compodocSymbol: string;

  /** Overview tab: variation sections (live demo + code). */
  variations: VariationDoc[];
  /** Overview tab: usage guidance (do / don't panels). */
  usage: UsageDoc;
  /** Overview tab: component activity section. */
  activity?: ActivityDoc;

  /**
   * Properties tab fallback. Prefer the Compodoc-generated map
   * (COMPONENT_PROPERTIES, keyed by compodocSymbol); this is only used when no
   * generated entry exists.
   */
  properties?: ApiDoc;
  /** Theming tab: overridable CSS custom properties. */
  theming: ThemingVar[];
}
```

Replace it with:

```ts
export type ComponentCategory =
  | 'Navigation'
  | 'Input'
  | 'Messaging'
  | 'Data Display'
  | 'Utilities';

/**
 * Fields shared by every documented "thing" (component or service) — what
 * the domain-agnostic Overview/Usage/Activity tab-content components and
 * DocsContextService key off of, regardless of which domain the doc
 * belongs to.
 */
export interface DocBase {
  name: string;
  slug: string;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  /** Short description shown on the Overview header card. */
  description: string;
  docsUrl?: string;
  /** Overview tab: usage guidance (do / don't panels). */
  usage: UsageDoc;
  /** Overview tab: activity section. */
  activity?: ActivityDoc;
}

/**
 * Front-matter for a documented component.
 *
 * Properties and variation code are hand-authored here for now; the plan is to
 * source properties from Compodoc JSON and variation code from raw imports
 * (`?raw`) in a later stage.
 * See docs/superpowers/specs/2026-06-29-component-page-design.md.
 */
export interface ComponentDoc extends DocBase {
  category: ComponentCategory;
  /** Class name Compodoc keys the generated Properties table by. */
  compodocSymbol: string;

  /** Overview tab: variation sections (live demo + code). */
  variations: VariationDoc[];

  /**
   * Properties tab fallback. Prefer the Compodoc-generated map
   * (COMPONENT_PROPERTIES, keyed by compodocSymbol); this is only used when no
   * generated entry exists.
   */
  properties?: ApiDoc;
  /** Theming tab: overridable CSS custom properties. */
  theming: ThemingVar[];
}
```

Leave `VariationDoc`, `UsageDoc`, `ActivityDoc`, `ApiDoc`, `ApiProp`, `ThemingVar` exactly as they are — only the top of the file changes.

- [ ] **Step 2: Widen `DocsContextService`**

Current file:

```ts
import { Injectable, signal } from '@angular/core';
import { ComponentDoc } from '@jax-data-science/component-docs';

@Injectable({ providedIn: 'root' })
export class DocsContextService {
  private _currentDoc = signal<ComponentDoc | null>(null);
  readonly currentDoc = this._currentDoc.asReadonly();

  setCurrentDoc(doc: ComponentDoc | null): void {
    this._currentDoc.set(doc);
  }
}
```

Replace with:

```ts
import { Injectable, signal } from '@angular/core';
import { DocBase } from '@jax-data-science/component-docs';

@Injectable({ providedIn: 'root' })
export class DocsContextService {
  private _currentDoc = signal<DocBase | null>(null);
  readonly currentDoc = this._currentDoc.asReadonly();

  setCurrentDoc(doc: DocBase | null): void {
    this._currentDoc.set(doc);
  }
}
```

- [ ] **Step 3: Verify nothing broke**

```bash
npx nx build components
npx nx build demo
npx nx test demo
```

Expected: all pass — `ComponentDoc` still has every field the existing components pages/specs use (`DocOverviewComponent`'s `statusLabel(status: 'stable'|'in-progress'|'deprecated')` still compiles since `DocBase.status` is that same union).

- [ ] **Step 4: Commit**

```bash
git add libs/components/src/lib/docs/docs.model.ts \
        apps/demo/src/app/docs-shell/docs-context.service.ts
git commit -m "refactor: extract DocBase so docs context/tab-content can serve services too"
```

---

## Task 2: `ServiceDoc` model, barrel, and public exports

**Files:**
- Create: `libs/api-clients/src/lib/docs/service-docs.model.ts`
- Create: `libs/api-clients/src/docs.ts`
- Modify: `libs/api-clients/src/index.ts`
- Modify: `tsconfig.base.json`

**Interfaces:**
- Consumes: `DocBase`, `UsageDoc`, `ActivityDoc` from `@jax-data-science/component-docs` (Task 1).
- Produces: `ServiceDoc`, `ServiceCategory`, `UsageExampleDoc`, `ApiMethodDoc`, `ApiMethod` — consumed by Task 3 (JSDoc/generator), Task 4 (`ontologyDoc`), Task 5 (`DocMethodsComponent`), Task 7 (`ServicesShellComponent`), Task 8 (`DocsLeftNavComponent`).

- [ ] **Step 1: Write the model**

```ts
// libs/api-clients/src/lib/docs/service-docs.model.ts
import { ActivityDoc, DocBase, UsageDoc } from '@jax-data-science/component-docs';

export type ServiceCategory = 'Ontology' | 'Data Access' | 'Async Processing' | 'Genomics';

/** Front-matter for a documented API client service. */
export interface ServiceDoc extends DocBase {
  category: ServiceCategory;
  /** Class Compodoc keys the generated Methods table by — abstract or concrete. */
  compodocSymbol: string;

  /** Overview tab: one example per way of using this service (e.g. per implementation). */
  usageExamples: UsageExampleDoc[];

  /**
   * Methods tab fallback. Prefer the Compodoc-generated map
   * (SERVICE_METHODS, keyed by compodocSymbol); this is only used when no
   * generated entry exists.
   */
  methods?: ApiMethodDoc;
}

export interface UsageExampleDoc {
  /** Anchor id used by the right-side "On this page" TOC. */
  id: string;
  title: string;
  description: string;
  /** Hand-authored — services have no live UI to derive a snippet from. */
  code: string;
  language: 'typescript';
}

export interface ApiMethodDoc {
  methods: ApiMethod[];
}

export interface ApiMethod {
  name: string;
  /** Rendered signature, e.g. `search(query: string, limit: number, ontology: Ontology)`. */
  signature: string;
  returnType: string;
  description: string;
}
```

Note `UsageDoc`/`ActivityDoc` are *not* redefined here — they're imported from the components barrel, per the spec's explicit "reused as-is" decision.

- [ ] **Step 2: Create the docs barrel**

```ts
// libs/api-clients/src/docs.ts
export * from './lib/docs/service-docs.model';
```

(Only the model is exported for now — `ontologyDoc` gets added here in Task 4, same as how `libs/components/src/docs.ts` grew one export per component.)

- [ ] **Step 3: Map the barrel path**

Modify `tsconfig.base.json`:

```json
"paths": {
  "@jax-data-science/api-clients": ["libs/api-clients/src/index.ts"],
  "@jax-data-science/components": ["libs/components/src/index.ts"],
  "@jax-data-science/themes": ["libs/themes/src/index.ts"],
  "@jax-data-science/component-docs": ["libs/components/src/docs.ts"],
  "@jax-data-science/service-docs": ["libs/api-clients/src/docs.ts"]
}
```

- [ ] **Step 4: Export the ontology model types from the public barrel**

The showcase page will need `Ontology` (enum) and `OntologyTerm` (interface), which today aren't exported from `libs/api-clients/src/index.ts` (only the three service classes are, at lines 17-19). Add, right after those three lines:

```ts
export * from './lib/services/ontology/ontology.model';
```

- [ ] **Step 5: Verify it builds**

```bash
npx nx build api-clients
```

Expected: success. (Nothing imports `@jax-data-science/service-docs` yet, so there's nothing to runtime-verify beyond compilation.)

- [ ] **Step 6: Commit**

```bash
git add libs/api-clients/src/lib/docs/service-docs.model.ts \
        libs/api-clients/src/docs.ts \
        libs/api-clients/src/index.ts \
        tsconfig.base.json
git commit -m "feat: add ServiceDoc model and services docs barrel"
```

---

## Task 3: JSDoc on the OntologyService contract + Methods generator

**Files:**
- Modify: `libs/api-clients/src/lib/services/ontology/ontology.service.base.ts`
- Create: `tools/generate-docs-methods.mjs`
- Modify: `package.json`
- Generated (commit the output): `apps/demo/src/app/docs-shell/generated/service-methods.generated.ts`

**Interfaces:**
- Consumes: `ApiMethodDoc`, `ApiMethod` from `@jax-data-science/service-docs` (Task 2).
- Produces: `SERVICE_METHODS: Record<string, ApiMethodDoc>` — consumed by Task 5 (`DocMethodsComponent`).

- [ ] **Step 1: Add JSDoc to the abstract contract**

Modify `libs/api-clients/src/lib/services/ontology/ontology.service.base.ts`:

```ts
import { Observable } from 'rxjs';
import { Ontology, OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../../models/response';

export abstract class OntologyService {
  /**
   * Search for terms in an ontology.
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search
   */
  abstract search(query: string, limit: number, ontology: Ontology): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get a term by its ID.
   * @param id - the term ID
   */
  abstract term(id: string): Observable<Response<OntologyTerm>>;

  /**
   * Get the parents of a term.
   * @param id - the term ID
   */
  abstract parents(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the children of a term.
   * @param id - the term ID
   */
  abstract children(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the ancestors of a term.
   * @param id - the term ID
   */
  abstract ancestors(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the descendants of a term.
   * @param id - the term ID
   */
  abstract descendants(id: string): Observable<CollectionResponse<OntologyTerm>>;
}
```

- [ ] **Step 2: Write the generator**

```js
#!/usr/bin/env node
/**
 * Generates the service Methods table data from source-of-truth JSDoc.
 *
 * Runs Compodoc over libs/api-clients to emit a documentation.json, then
 * extracts each class's methods (from either `doc.classes` — plain classes
 * like abstract service contracts — or `doc.injectables` — @Injectable
 * services) into a typed TS map the docs viewer imports. Regenerate with
 * `pnpm docs:methods` whenever a service's public methods or their JSDoc
 * change.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TSCONFIG = 'libs/api-clients/tsconfig.lib.json';
const OUT_FILE =
  'apps/demo/src/app/docs-shell/generated/service-methods.generated.ts';

const tmp = mkdtempSync(join(tmpdir(), 'compodoc-'));

try {
  execFileSync(
    'npx',
    ['compodoc', '-p', TSCONFIG, '-e', 'json', '-d', tmp, '--silent'],
    { stdio: 'inherit' }
  );

  const doc = JSON.parse(readFileSync(join(tmp, 'documentation.json'), 'utf8'));

  // Compodoc renders JSDoc descriptions to HTML; flatten back to plain text.
  const stripHtml = (s) =>
    (s || '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const toMethod = (m) => ({
    name: m.name,
    signature: `${m.name}(${(m.args || [])
      .map((a) => `${a.name}: ${a.type}`)
      .join(', ')})`,
    returnType: m.returnType || 'void',
    description: stripHtml(m.description),
  });

  const map = {};
  // Abstract/plain classes (e.g. an abstract service contract) live under
  // `classes`; concrete @Injectable services live under `injectables`.
  for (const c of [...(doc.classes || []), ...(doc.injectables || [])]) {
    if (!c.methods || c.methods.length === 0) continue;
    map[c.name] = { methods: c.methods.map(toMethod) };
  }

  const banner =
    '// GENERATED by tools/generate-docs-methods.mjs — do not edit.\n' +
    '// Source of truth: JSDoc + method signatures in libs/api-clients.\n' +
    "// Regenerate with `pnpm docs:methods`.\n";

  const body =
    "import { ApiMethodDoc } from '@jax-data-science/service-docs';\n\n" +
    'export const SERVICE_METHODS: Record<string, ApiMethodDoc> = ' +
    JSON.stringify(map, null, 2) +
    ';\n';

  writeFileSync(OUT_FILE, banner + '\n' + body);
  console.log(`Wrote ${OUT_FILE} (${Object.keys(map).length} classes)`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
```

- [ ] **Step 3: Wire up the package script**

Modify `package.json` (currently):

```json
"docs:properties": "node tools/generate-docs-properties.mjs",
"docs:snippets": "node tools/generate-docs-snippets.mjs",
"docs:generate": "pnpm docs:properties && pnpm docs:snippets"
```

Replace with:

```json
"docs:properties": "node tools/generate-docs-properties.mjs",
"docs:methods": "node tools/generate-docs-methods.mjs",
"docs:snippets": "node tools/generate-docs-snippets.mjs",
"docs:generate": "pnpm docs:properties && pnpm docs:methods && pnpm docs:snippets"
```

- [ ] **Step 4: Run it and verify the output**

```bash
pnpm docs:methods
```

Expected: `Wrote apps/demo/src/app/docs-shell/generated/service-methods.generated.ts (N classes)`.

```bash
grep -A 8 '"OntologyService"' apps/demo/src/app/docs-shell/generated/service-methods.generated.ts
```

Expected: a `search` (and 5 other) method entries, each with a non-empty `description` (e.g. `"Search for terms in an ontology."`), since JaxOntologyService's `search` already has its own JSDoc — but the abstract `OntologyService.search` entry (the one `compodocSymbol: 'OntologyService'` will key off of) is the one that gained JSDoc in Step 1, and must show a non-empty description now too.

- [ ] **Step 5: Commit**

```bash
git add tools/generate-docs-methods.mjs \
        package.json \
        libs/api-clients/src/lib/services/ontology/ontology.service.base.ts \
        apps/demo/src/app/docs-shell/generated/service-methods.generated.ts
git commit -m "feat: generate service Methods tables from Compodoc JSDoc"
```

---

## Task 4: `ontologyDoc` front-matter

**Files:**
- Create: `libs/api-clients/src/lib/services/ontology/ontology.docs.ts`
- Modify: `libs/api-clients/src/docs.ts`

**Interfaces:**
- Consumes: `ServiceDoc`, `UsageExampleDoc` from `@jax-data-science/service-docs` (Task 2).
- Produces: `ontologyDoc: ServiceDoc` (slug `'ontology'`, `compodocSymbol: 'OntologyService'`) — consumed by Task 7 (`ServicesShellComponent`'s `ALL_SERVICE_DOCS`) and Task 9 (showcase page).

- [ ] **Step 1: Write the front-matter**

```ts
// libs/api-clients/src/lib/services/ontology/ontology.docs.ts
import { ServiceDoc } from '../../docs/service-docs.model';

export const ontologyDoc: ServiceDoc = {
  name: 'Ontology Service',
  slug: 'ontology',
  category: 'Ontology',
  status: 'in-progress',
  tags: ['ontology', 'search', 'terms'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'OntologyService',
  description:
    'Search and traverse biomedical ontology terms (HP, MONDO, MP, CL, MAXO). ' +
    'Two interchangeable implementations are available, hitting different real backends.',
  usageExamples: [
    {
      id: 'jax-ontology',
      title: 'Using JaxOntologyService',
      description:
        'Hits JAX’s own ontology-service backend, configured from a remote JSON config fetched on construction.',
      code: `import { inject } from '@angular/core';
import { JaxOntologyService, Ontology } from '@jax-data-science/api-clients';

export class MyComponent {
  private ontologyService = inject(JaxOntologyService);

  searchHpo(query: string) {
    return this.ontologyService.search(query, 10, Ontology.HP);
  }
}`,
      language: 'typescript',
    },
    {
      id: 'ols-ontology',
      title: 'Using OLSOntologyService',
      description: 'Hits EBI’s public OLS (Ontology Lookup Service) API directly — no config needed.',
      code: `import { inject } from '@angular/core';
import { OLSOntologyService, Ontology } from '@jax-data-science/api-clients';

export class MyComponent {
  private ontologyService = inject(OLSOntologyService);

  searchHpo(query: string) {
    return this.ontologyService.search(query, 10, Ontology.HP);
  }
}`,
      language: 'typescript',
    },
  ],
  usage: {
    summary:
      'Inject whichever OntologyService implementation matches the backend you need; ' +
      'both honor the same contract.',
    dos: [
      'Prefer JaxOntologyService for JAX-curated ontology data.',
      'Use OLSOntologyService when you need EBI-hosted ontologies not mirrored by JAX.',
    ],
    donts: [
      'Do not assume paging shape is identical between implementations — OLS-specific paging fields differ from JAX’s.',
    ],
  },
  activity: {
    summary: 'New — not yet adopted by any component in this toolkit. Demoed here to establish the services docs pattern.',
  },
};
```

- [ ] **Step 2: Export it from the services docs barrel**

```ts
// libs/api-clients/src/docs.ts
export * from './lib/docs/service-docs.model';
export * from './lib/services/ontology/ontology.docs';
```

- [ ] **Step 3: Verify it builds**

```bash
npx nx build api-clients
```

- [ ] **Step 4: Commit**

```bash
git add libs/api-clients/src/lib/services/ontology/ontology.docs.ts \
        libs/api-clients/src/docs.ts
git commit -m "docs: add ontology service front-matter"
```

---

## Task 5: `DocMethodsComponent`

**Files:**
- Create: `apps/demo/src/app/docs-shell/tab-content/doc-methods/doc-methods.component.ts`
- Create: `apps/demo/src/app/docs-shell/tab-content/doc-methods/doc-methods.component.html`
- Test: `apps/demo/src/app/docs-shell/tab-content/doc-methods/doc-methods.component.spec.ts`

**Interfaces:**
- Consumes: `DocsContextService` (Task 1), `SERVICE_METHODS` (Task 3), `ApiMethodDoc` from `@jax-data-science/service-docs` (Task 2). Reads `docsContext.currentDoc()` and expects it to be a `ServiceDoc` (only true when routed under `/services/*` — see Task 7).
- Produces: `DocMethodsComponent`, selector `app-doc-methods` — consumed by Task 7 (`services-shell.component.html`).

This is a fork of `DocPropertiesComponent`, not a generalization of it — same reasoning as the spec's Approach C: the two are similar in shape but have different columns and a different generated-map source, so forking avoids threading two incompatible table shapes through one component.

- [ ] **Step 1: Write the component**

```ts
// apps/demo/src/app/docs-shell/tab-content/doc-methods/doc-methods.component.ts
import { Component, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiMethodDoc, ServiceDoc } from '@jax-data-science/service-docs';
import { DocsContextService } from '../../docs-context.service';
import { SERVICE_METHODS } from '../../generated/service-methods.generated';

const EMPTY: ApiMethodDoc = { methods: [] };

@Component({
  selector: 'app-doc-methods',
  imports: [TableModule],
  templateUrl: './doc-methods.component.html',
  standalone: true,
})
export class DocMethodsComponent {
  readonly docsContext = inject(DocsContextService);

  /** Prefer the Compodoc-generated map; fall back to hand-authored front-matter. */
  readonly apiMethods = computed<ApiMethodDoc>(() => {
    const doc = this.docsContext.currentDoc() as ServiceDoc | null;
    if (!doc) return EMPTY;
    return SERVICE_METHODS[doc.compodocSymbol] ?? doc.methods ?? EMPTY;
  });
}
```

- [ ] **Step 2: Write the template**

```html
<!-- apps/demo/src/app/docs-shell/tab-content/doc-methods/doc-methods.component.html -->
@let api = apiMethods();
<div class="tw-p-8 tw-max-w-5xl">
  <section>
    <h2 class="tw-text-2xl tw-font-semibold tw-mb-4">Methods</h2>
    @if (api.methods.length === 0) {
      <p class="tw-text-gray-500">No methods.</p>
    } @else {
      <p-table [value]="api.methods" [sortField]="'name'" [sortOrder]="1">
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
            <th>Signature</th>
            <th>Return Type</th>
            <th>Description</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-method>
          <tr>
            <td><code>{{ method.name }}</code></td>
            <td><code>{{ method.signature }}</code></td>
            <td><code>{{ method.returnType }}</code></td>
            <td>{{ method.description }}</td>
          </tr>
        </ng-template>
      </p-table>
    }
  </section>
</div>
```

- [ ] **Step 3: Write the spec**

```ts
// apps/demo/src/app/docs-shell/tab-content/doc-methods/doc-methods.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMethodsComponent } from './doc-methods.component';

describe('DocMethodsComponent', () => {
  let component: DocMethodsComponent;
  let fixture: ComponentFixture<DocMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocMethodsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

- [ ] **Step 4: Verify**

```bash
npx nx test demo
npx nx build demo
```

- [ ] **Step 5: Commit**

```bash
git add apps/demo/src/app/docs-shell/tab-content/doc-methods/
git commit -m "feat: add DocMethodsComponent for the services Methods tab"
```

---

## Task 6: `ServicesTabsComponent` and `ServicesRightTocComponent`

**Files:**
- Create: `apps/demo/src/app/services-shell/services-tabs/services-tabs.component.ts`
- Create: `apps/demo/src/app/services-shell/services-right-toc/services-right-toc.component.ts`

**Interfaces:**
- Consumes: `ServiceDoc` from `@jax-data-science/service-docs` (Task 2).
- Produces: `ServicesTabsComponent` (selector `app-services-tabs`, `@Input() slug`), `ServicesRightTocComponent` (selector `app-services-right-toc`, `@Input() doc!: ServiceDoc`) — both consumed by Task 7.

Forks of `DocsTabsComponent`/`DocsRightTocComponent`: same reasoning as Task 5 — tab set and base route differ (`Overview`/`Methods` vs `Overview`/`Properties`/`Theming`, and `/services/...` vs `/components/...`), and the TOC reads `usageExamples` instead of `variations`.

- [ ] **Step 1: Write `ServicesTabsComponent`**

```ts
// apps/demo/src/app/services-shell/services-tabs/services-tabs.component.ts
import { Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-services-tabs',
  imports: [TabsModule],
  standalone: true,
  template: `
    <div class="docs-tabs tw-pt-4 tw-px-6">
      <p-tabs [value]="activeTab()" (valueChange)="navigate($event)">
        <p-tablist>
          @for (tab of tabs; track tab.path) {
            <p-tab [value]="tab.path">{{ tab.label }}</p-tab>
          }
        </p-tablist>
      </p-tabs>
    </div>
  `,
})
export class ServicesTabsComponent implements OnInit, OnDestroy {
  @Input() slug = '';

  private router = inject(Router);
  private destroy$ = new Subject<void>();

  readonly activeTab = signal<string>('overview');

  readonly tabs = [
    { label: 'Overview', path: 'overview' },
    { label: 'Methods', path: 'methods' },
  ];

  ngOnInit(): void {
    this.syncFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => this.syncFromUrl((e as NavigationEnd).urlAfterRedirects));
  }

  navigate(value: string | number | undefined): void {
    if (!value || value === this.activeTab()) return;
    this.router.navigate(['/services', this.slug, value]);
  }

  private syncFromUrl(url: string): void {
    const last = url.split('?')[0].split('/').filter(Boolean).pop() ?? '';
    const match = this.tabs.find((t) => t.path === last);
    this.activeTab.set(match ? match.path : 'overview');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

- [ ] **Step 2: Write `ServicesRightTocComponent`**

```ts
// apps/demo/src/app/services-shell/services-right-toc/services-right-toc.component.ts
import {
  AfterViewChecked,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  signal,
} from '@angular/core';
import { ServiceDoc } from '@jax-data-science/service-docs';

interface TocItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-services-right-toc',
  imports: [],
  standalone: true,
  template: `
    <aside class="tw-w-56 tw-flex-shrink-0 tw-h-full tw-overflow-y-auto tw-p-4 tw-border-l tw-border-gray-200 tw-bg-white">
      <p class="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-widest tw-text-gray-400 tw-mb-3">On this page</p>
      <ul class="tw-list-none tw-p-0 tw-m-0 tw-space-y-1">
        @for (item of items(); track item.id) {
          <li>
            <a
              [href]="'#' + item.id"
              class="tw-block tw-text-sm tw-py-1 tw-px-2 tw-rounded tw-transition-colors tw-no-underline"
              [class.tw-font-semibold]="item.id === activeId()"
              [class.tw-text-blue-600]="item.id === activeId()"
              [class.tw-bg-blue-50]="item.id === activeId()"
              [class.tw-text-gray-600]="item.id !== activeId()"
              (click)="scrollTo(item.id, $event)">
              {{ item.title }}
            </a>
          </li>
        }
      </ul>
    </aside>
  `,
})
export class ServicesRightTocComponent implements OnChanges, AfterViewChecked, OnDestroy {
  @Input() doc!: ServiceDoc;

  items = signal<TocItem[]>([]);
  activeId = signal<string>('');

  private observer?: IntersectionObserver;
  private needsObserverRebind = false;

  ngOnChanges(): void {
    this.items.set(this.buildItems());
    this.needsObserverRebind = true;
  }

  ngAfterViewChecked(): void {
    if (this.needsObserverRebind) {
      this.needsObserverRebind = false;
      this.rebindObserver();
    }
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  /** Summary + each usage example + Usage + Activity (per the services docs design). */
  private buildItems(): TocItem[] {
    if (!this.doc) return [];
    const items: TocItem[] = [{ id: 'summary', title: 'Summary' }];
    for (const example of this.doc.usageExamples) {
      items.push({ id: example.id, title: example.title });
    }
    items.push({ id: 'usage', title: 'Usage' });
    if (this.doc.activity) {
      items.push({ id: 'activity', title: 'Activity' });
    }
    return items;
  }

  private rebindObserver(): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          this.activeId.set(visible[0].target.id);
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    );
    for (const item of this.items()) {
      const el = document.getElementById(item.id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
```

- [ ] **Step 3: Verify it builds**

```bash
npx nx build demo
```

- [ ] **Step 4: Commit**

```bash
git add apps/demo/src/app/services-shell/services-tabs/ \
        apps/demo/src/app/services-shell/services-right-toc/
git commit -m "feat: add ServicesTabsComponent and ServicesRightTocComponent"
```

---

## Task 7: `ServicesShellComponent`

**Files:**
- Create: `apps/demo/src/app/services-shell/services-shell.component.ts`
- Create: `apps/demo/src/app/services-shell/services-shell.component.html`
- Modify: `apps/demo/src/app/docs-shell/docs-shell.component.ts` (export `ALL_DOCS`)

**Interfaces:**
- Consumes: `ontologyDoc` from `@jax-data-science/service-docs` (Task 4); `ALL_DOCS` from `docs-shell.component.ts` (exported in Step 1 below); `DocsContextService` (Task 1); `ServicesTabsComponent`/`ServicesRightTocComponent` (Task 6); `DocsLeftNavComponent` (modified in Task 8 — this task uses it with only the `[docs]` input until Task 8 adds `[services]`).
- Produces: `ServicesShellComponent`, selector `app-services-shell` — consumed by Task 10 (`app.routes.ts`).

- [ ] **Step 1: Export `ALL_DOCS` from `docs-shell.component.ts`**

In `apps/demo/src/app/docs-shell/docs-shell.component.ts`, change:

```ts
const ALL_DOCS: ComponentDoc[] = [
```

to:

```ts
export const ALL_DOCS: ComponentDoc[] = [
```

(No other change in that file — this lets `ServicesShellComponent` pass the same six component docs to the shared left nav's `[docs]` input, so the Components section still renders correctly while browsing Services. It's the same six doc objects already defined once in `@jax-data-science/component-docs`; nothing is duplicated except the reference.)

- [ ] **Step 2: Write `ServicesShellComponent`**

```ts
// apps/demo/src/app/services-shell/services-shell.component.ts
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { ServiceDoc, ontologyDoc } from '@jax-data-science/service-docs';

import { ALL_DOCS } from '../docs-shell/docs-shell.component';
import { DocsContextService } from '../docs-shell/docs-context.service';
import { DocsLeftNavComponent } from '../docs-shell/docs-left-nav/docs-left-nav.component';
import { ServicesTabsComponent } from './services-tabs/services-tabs.component';
import { ServicesRightTocComponent } from './services-right-toc/services-right-toc.component';

export const ALL_SERVICE_DOCS: ServiceDoc[] = [ontologyDoc];

const SERVICES_REGISTRY = new Map<string, ServiceDoc>(ALL_SERVICE_DOCS.map((d) => [d.slug, d]));

@Component({
  selector: 'app-services-shell',
  imports: [RouterModule, DocsLeftNavComponent, ServicesTabsComponent, ServicesRightTocComponent],
  templateUrl: './services-shell.component.html',
  standalone: true,
  host: { class: 'tw-flex tw-flex-1 tw-h-full tw-w-full tw-overflow-hidden' },
})
export class ServicesShellComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private docsContext = inject(DocsContextService);
  private destroy$ = new Subject<void>();

  readonly allDocs = ALL_DOCS;
  readonly allServices = ALL_SERVICE_DOCS;
  readonly currentDoc = this.docsContext.currentDoc;
  readonly currentSlug = signal<string>('');

  readonly showToc = computed(() => {
    this.currentSlug();
    const url = this.router.url;
    return url.endsWith('/overview') || /\/services\/[^/]+$/.test(url);
  });

  ngOnInit(): void {
    this.updateFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        this.updateFromUrl((e as NavigationEnd).urlAfterRedirects);
      });
  }

  private updateFromUrl(url: string): void {
    const segments = url.split('/').filter(Boolean);
    // URL shape: /services/:slug/:tab — segments[0]='services', segments[1]=slug
    const slug = segments[1] ?? '';
    this.currentSlug.set(slug);
    this.docsContext.setCurrentDoc(SERVICES_REGISTRY.get(slug) ?? null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

- [ ] **Step 3: Write the template**

```html
<!-- apps/demo/src/app/services-shell/services-shell.component.html -->
<div class="tw-flex tw-h-full tw-min-h-0 tw-w-full">
  <!-- Left nav: shared with the Components shell, shows both sections -->
  <app-docs-left-nav [docs]="allDocs" [services]="allServices"></app-docs-left-nav>

  <!-- Main area -->
  <div class="tw-flex tw-flex-col tw-flex-1 tw-min-w-0 tw-min-h-0 tw-overflow-hidden">
    <!-- Tab bar -->
    @if (currentDoc()) {
      <app-services-tabs [slug]="currentDoc()!.slug"></app-services-tabs>
    }

    <!-- Content + right TOC -->
    <div class="tw-flex tw-flex-1 tw-min-h-0 tw-overflow-hidden">
      <div class="tw-flex-1 tw-min-w-0 tw-min-h-0 tw-overflow-y-auto">
        <router-outlet></router-outlet>
      </div>

      <!-- Right TOC ("On this page"): shown on the Overview tab -->
      @if (showToc() && currentDoc()) {
        <app-services-right-toc [doc]="currentDoc()!"></app-services-right-toc>
      }
    </div>
  </div>
</div>
```

Note: `[services]="allServices"` on `app-docs-left-nav` doesn't exist as an input yet — it's added in Task 8. This task compiles once Task 8 lands; the two are sequenced this way because the shell's template is easiest to write with the final left-nav contract in view, but Task 8 is a small, independent, testable change in its own right (left nav rendering), so it stays a separate task/commit.

- [ ] **Step 4: Commit**

```bash
git add apps/demo/src/app/docs-shell/docs-shell.component.ts \
        apps/demo/src/app/services-shell/services-shell.component.ts \
        apps/demo/src/app/services-shell/services-shell.component.html
git commit -m "feat: add ServicesShellComponent"
```

(Build verification is deferred to Task 8, once `DocsLeftNavComponent` actually has the `[services]` input this template references — attempting `nx build demo` between Task 7 and Task 8 will fail on that missing input, which is expected and not a regression to chase down mid-task.)

---

## Task 8: `DocsLeftNavComponent` — data-driven Services block

**Files:**
- Modify: `apps/demo/src/app/docs-shell/docs-left-nav/docs-left-nav.component.ts`

**Interfaces:**
- Consumes: `ServiceDoc`, `ServiceCategory` from `@jax-data-science/service-docs` (Task 2).
- Produces: `DocsLeftNavComponent.services: @Input() ServiceDoc[]` — satisfies the template written in Task 7.

This replaces the two hardcoded, one-broken `<a>` tags with the same category-grouped, data-driven pattern already used for Components — fixing the dead `/services/isa-data` link as a direct consequence (there's no `isa-data` `ServiceDoc` yet, so it simply won't appear; `isa-data`'s existing legacy page keeps working at its current `/services/docs/isa-data` route, untouched).

- [ ] **Step 1: Modify the component**

Current file is reproduced in full in the design survey; make these changes to
`apps/demo/src/app/docs-left-nav/docs-left-nav.component.ts`:

Add imports and a services category order, alongside the existing `CATEGORY_ORDER`:

```ts
import { Component, Input, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentCategory, ComponentDoc } from '@jax-data-science/component-docs';
import { ServiceCategory, ServiceDoc } from '@jax-data-science/service-docs';

const CATEGORY_ORDER: ComponentCategory[] = [
  'Navigation',
  'Input',
  'Messaging',
  'Data Display',
  'Utilities',
];

const SERVICE_CATEGORY_ORDER: ServiceCategory[] = [
  'Ontology',
  'Data Access',
  'Async Processing',
  'Genomics',
];

interface CategoryGroup {
  category: ComponentCategory;
  docs: ComponentDoc[];
}

interface ServiceCategoryGroup {
  category: ServiceCategory;
  docs: ServiceDoc[];
}
```

Replace the hardcoded Services `<div>` block:

```html
<!-- Services -->
<div class="tw-flex tw-flex-col tw-gap-2">
  <button class="tw-flex tw-items-center tw-w-full tw-bg-transparent tw-border-none tw-cursor-pointer tw-p-0 tw-text-[#454545]" (click)="servicesOpen = !servicesOpen">
    <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-globe"></i></span>
    <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">Services</span>
    <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-sm tw-flex-shrink-0 tw-transition-transform tw-duration-150" [class.-tw-rotate-90]="!servicesOpen">
      <i class="pi pi-chevron-down"></i>
    </span>
  </button>
  @if (servicesOpen) {
    <div class="tw-bg-white tw-border tw-border-[#d9d9d9] tw-rounded-md tw-p-1 tw-flex tw-flex-col">
      <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]" routerLink="/services/isa-data" routerLinkActive="tw-bg-[#0177b2] tw-text-white">ISA Data</a>
      <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]" routerLink="/services/phenotype" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Phenotype (In Progress)</a>
    </div>
  }
</div>
```

with:

```html
<!-- Services -->
<div class="tw-flex tw-flex-col tw-gap-2">
  <button class="tw-flex tw-items-center tw-w-full tw-bg-transparent tw-border-none tw-cursor-pointer tw-p-0 tw-text-[#454545]" (click)="servicesOpen = !servicesOpen">
    <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-globe"></i></span>
    <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">Services</span>
    <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-sm tw-flex-shrink-0 tw-transition-transform tw-duration-150" [class.-tw-rotate-90]="!servicesOpen">
      <i class="pi pi-chevron-down"></i>
    </span>
  </button>
  @if (servicesOpen) {
    <div class="tw-bg-white tw-border tw-border-[#d9d9d9] tw-rounded-md tw-p-1 tw-flex tw-flex-col">
      @for (group of serviceCategoryGroups; track group.category) {
        <span class="tw-block tw-px-2 tw-pt-2 tw-pb-1 tw-text-base tw-font-bold tw-text-[#222] tw-leading-none">{{ group.category }}</span>
        @for (doc of group.docs; track doc.slug) {
          <a class="tw-flex tw-items-center tw-p-2 tw-pl-6 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]"
             [routerLink]="['/services', doc.slug, 'overview']"
             routerLinkActive="tw-bg-[#0177b2] tw-text-white">{{ doc.name }}</a>
        }
      }
    </div>
  }
</div>
```

Update the class body:

```ts
export class DocsLeftNavComponent implements OnChanges {
  @Input() docs: ComponentDoc[] = [];
  @Input() services: ServiceDoc[] = [];

  categoryGroups: CategoryGroup[] = [];
  serviceCategoryGroups: ServiceCategoryGroup[] = [];
  gettingStartedOpen = true;
  componentsOpen = true;
  servicesOpen = true;

  ngOnChanges(): void {
    this.categoryGroups = CATEGORY_ORDER.flatMap((category) => {
      const docs = this.docs.filter((d) => d.category === category);
      return docs.length ? [{ category, docs }] : [];
    });
    this.serviceCategoryGroups = SERVICE_CATEGORY_ORDER.flatMap((category) => {
      const docs = this.services.filter((d) => d.category === category);
      return docs.length ? [{ category, docs }] : [];
    });
  }
}
```

- [ ] **Step 2: Update the existing usage in `docs-shell.component.html`**

`apps/demo/src/app/docs-shell/docs-shell.component.html` currently has:

```html
<app-docs-left-nav [docs]="allDocs"></app-docs-left-nav>
```

Change to also pass services (so the Services section renders while browsing Components too):

```html
<app-docs-left-nav [docs]="allDocs" [services]="allServices"></app-docs-left-nav>
```

This requires `DocsShellComponent` (in `docs-shell.component.ts`) to expose `allServices` the same way it exposes `allDocs`. Add, importing from the services shell:

```ts
import { ALL_SERVICE_DOCS } from '../services-shell/services-shell.component';
```

```ts
readonly allDocs = ALL_DOCS;
readonly allServices = ALL_SERVICE_DOCS;
```

(next to the existing `readonly allDocs = ALL_DOCS;` line).

- [ ] **Step 3: Verify it builds**

```bash
npx nx build demo
npx nx lint demo
```

Expected: both succeed now that `DocsLeftNavComponent` has the `[services]` input `ServicesShellComponent`'s template (Task 7) and `DocsShellComponent`'s template (this step) both reference.

- [ ] **Step 4: Commit**

```bash
git add apps/demo/src/app/docs-shell/docs-left-nav/docs-left-nav.component.ts \
        apps/demo/src/app/docs-shell/docs-shell.component.ts \
        apps/demo/src/app/docs-shell/docs-shell.component.html
git commit -m "feat: make left nav Services section data-driven, fixing dead isa-data link"
```

---

## Task 9: `showcase-ontology` page

**Files:**
- Create: `apps/demo/src/app/services/pages/ontology/showcase-ontology.component.ts`
- Create: `apps/demo/src/app/services/pages/ontology/showcase-ontology.component.html`
- Create: `apps/demo/src/app/services/pages/ontology/showcase-ontology.component.css`
- Create: `apps/demo/src/app/services/pages/ontology/showcase-ontology.component.spec.ts`

**Interfaces:**
- Consumes: `JaxOntologyService`, `OLSOntologyService`, `Ontology` from `@jax-data-science/api-clients` (Task 2's barrel export); `ontologyDoc` from `@jax-data-science/service-docs` (Task 4); `DocOverviewComponent`, `DocUsageComponent`, `DocActivityComponent` (existing, unmodified — Approach C's "reuse as-is").
- Produces: `ShowcaseOntologyComponent` — consumed by Task 10 (`app.routes.ts`).

Both usage examples make real, live HTTP calls on page load — no mocks, no auth needed, per the design.

- [ ] **Step 1: Write the component**

```ts
// apps/demo/src/app/services/pages/ontology/showcase-ontology.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaxOntologyService, OLSOntologyService, Ontology } from '@jax-data-science/api-clients';
import { ontologyDoc } from '@jax-data-science/service-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-ontology',
  imports: [CommonModule, DocOverviewComponent, DocUsageComponent, DocActivityComponent],
  templateUrl: './showcase-ontology.component.html',
  styleUrl: './showcase-ontology.component.css',
  standalone: true,
})
export class ShowcaseOntologyComponent {
  private jaxOntology = inject(JaxOntologyService);
  private olsOntology = inject(OLSOntologyService);
  readonly doc = ontologyDoc;

  jaxResults$ = this.jaxOntology.search('fever', 5, Ontology.HP);
  olsResults$ = this.olsOntology.search('fever', 5, Ontology.HP);
}
```

- [ ] **Step 2: Write the template**

```html
<!-- apps/demo/src/app/services/pages/ontology/showcase-ontology.component.html -->
<div class="tw-p-8 tw-max-w-4xl">
  <app-doc-overview></app-doc-overview>

  <section id="jax-ontology" class="tw-mt-12">
    <h2 class="tw-text-2xl tw-font-semibold tw-mb-2">Using JaxOntologyService</h2>
    <p class="tw-text-gray-700 tw-mb-4">{{ doc.usageExamples[0].description }}</p>
    <pre class="tw-bg-gray-100 tw-p-4 tw-rounded tw-text-sm tw-overflow-auto"><code>{{ doc.usageExamples[0].code }}</code></pre>
    <h3 class="tw-text-lg tw-font-semibold tw-mt-4 tw-mb-2">Live result — search('fever', 5, Ontology.HP)</h3>
    @if (jaxResults$ | async; as jaxResults) {
      <ul class="tw-list-disc tw-pl-6">
        @for (term of jaxResults.data; track term.id) {
          <li>{{ term.id }} — {{ term.name }}</li>
        }
        @empty {
          <li class="tw-text-gray-500">No results.</li>
        }
      </ul>
    } @else {
      <p class="tw-text-gray-500">Loading…</p>
    }
  </section>

  <section id="ols-ontology" class="tw-mt-12">
    <h2 class="tw-text-2xl tw-font-semibold tw-mb-2">Using OLSOntologyService</h2>
    <p class="tw-text-gray-700 tw-mb-4">{{ doc.usageExamples[1].description }}</p>
    <pre class="tw-bg-gray-100 tw-p-4 tw-rounded tw-text-sm tw-overflow-auto"><code>{{ doc.usageExamples[1].code }}</code></pre>
    <h3 class="tw-text-lg tw-font-semibold tw-mt-4 tw-mb-2">Live result — search('fever', 5, Ontology.HP)</h3>
    @if (olsResults$ | async; as olsResults) {
      <ul class="tw-list-disc tw-pl-6">
        @for (term of olsResults.data; track term.id) {
          <li>{{ term.id }} — {{ term.name }}</li>
        }
        @empty {
          <li class="tw-text-gray-500">No results.</li>
        }
      </ul>
    } @else {
      <p class="tw-text-gray-500">Loading…</p>
    }
  </section>

  <app-doc-usage></app-doc-usage>
  <app-doc-activity></app-doc-activity>
</div>
```

- [ ] **Step 3: Empty CSS file**

```css
/* apps/demo/src/app/services/pages/ontology/showcase-ontology.component.css */
```

- [ ] **Step 4: Write the spec**

```ts
// apps/demo/src/app/services/pages/ontology/showcase-ontology.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { JaxOntologyService, OLSOntologyService } from '@jax-data-science/api-clients';

import { ShowcaseOntologyComponent } from './showcase-ontology.component';

const mockCollectionResponse = {
  data: [{ id: 'HP:0001945', name: 'Fever' }],
  paging: { page: 1, total_pages: 1, total_items: 1 },
};

const mockJaxOntology = { search: jest.fn().mockReturnValue(of(mockCollectionResponse)) };
const mockOlsOntology = { search: jest.fn().mockReturnValue(of(mockCollectionResponse)) };

describe('ShowcaseOntologyComponent', () => {
  let component: ShowcaseOntologyComponent;
  let fixture: ComponentFixture<ShowcaseOntologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseOntologyComponent],
      providers: [
        { provide: JaxOntologyService, useValue: mockJaxOntology },
        { provide: OLSOntologyService, useValue: mockOlsOntology },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

- [ ] **Step 5: Verify**

```bash
npx nx test demo
npx nx build demo
```

- [ ] **Step 6: Commit**

```bash
git add apps/demo/src/app/services/pages/ontology/
git commit -m "feat: add ontology service showcase page"
```

---

## Task 10: Wire routes and full verification

**Files:**
- Modify: `apps/demo/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `ServicesShellComponent` (Task 7), `DocMethodsComponent` (Task 5), `ShowcaseOntologyComponent` (Task 9).

- [ ] **Step 1: Add the imports and route block**

Modify `apps/demo/src/app/app.routes.ts` — add imports near the existing `DocsShellComponent`/`DocPropertiesComponent`/`DocThemingComponent` imports:

```ts
import { ServicesShellComponent } from './services-shell/services-shell.component';
import { DocMethodsComponent } from './docs-shell/tab-content/doc-methods/doc-methods.component';
import { ShowcaseOntologyComponent } from './services/pages/ontology/showcase-ontology.component';
```

Add a new top-level route block, placed after the `components` block and before the "Legacy routes" comment (so it's alongside the legacy `services/docs` block, not nested inside it):

```ts
{
  path: 'services',
  component: ServicesShellComponent,
  children: [
    { path: '', redirectTo: 'ontology/overview', pathMatch: 'full' },
    {
      path: 'ontology',
      children: [
        { path: 'overview', component: ShowcaseOntologyComponent },
        { path: 'methods', component: DocMethodsComponent },
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
      ],
    },
  ],
},
```

The existing `services/docs` block (serving `isa-data`) is untouched — both blocks coexist, same as `components` and the shrinking `components/docs` legacy block do today.

- [ ] **Step 2: Regenerate everything and verify the full workspace**

```bash
pnpm docs:generate
npx nx build api-clients
npx nx build components
npx nx build demo
npx nx lint demo
npx nx lint api-clients
npx nx test demo
npx nx test api-clients
```

Expected: all succeed with zero new lint errors (pre-existing warnings elsewhere are fine, matching the standard set in the Components migration).

- [ ] **Step 3: Commit**

```bash
git add apps/demo/src/app/app.routes.ts
git commit -m "feat: wire ontology service docs routes"
```

---

## Task 11: Live verification

**Files:** none (verification only).

- [ ] **Step 1: Serve and check the page renders with real data**

```bash
pnpm start
# open /services/ontology/overview
```

Check: both "Using JaxOntologyService" and "Using OLSOntologyService" sections show a non-empty list of real HP (Human Phenotype Ontology) terms matching "fever" — not mocked, not empty-by-default. Check the browser console for errors.

- [ ] **Step 2: Check the Methods tab**

```bash
# open /services/ontology/methods
```

Check: all 6 methods (`search`, `term`, `parents`, `children`, `ancestors`, `descendants`) are listed with non-empty descriptions (from the JSDoc added to `OntologyService` in Task 3) and correct signatures/return types.

- [ ] **Step 3: Check the left nav**

Confirm the left nav's Services section shows "Ontology Service" under an "Ontology" category header, and that the old "ISA Data" / "Phenotype (In Progress)" links are gone (superseded by the data-driven block — `isa-data`'s actual page is still reachable at its unchanged legacy route, just no longer linked from this now-data-driven block; that's an acceptable, explicitly out-of-scope gap for this pass, not a regression to fix here).

- [ ] **Step 4: Confirm no regressions to the Components section**

Click through `/components/progress-widget/overview` (or any migrated component) and confirm it still renders correctly with the Services section also visible (and collapsed/expanded) in the same left nav.

- [ ] **Step 5: Commit (if any last fixes were needed)**

```bash
git add -A
git commit -m "chore: final verification pass for ontology services docs"
```

(Skip this commit if steps 1-4 required no code changes.)
