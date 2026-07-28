# Services Docs Section — Design

## Context

The `apps/demo` docs system currently documents Angular *components* only,
via a generation-driven pipeline (see
[`docs/contributing-a-component.md`](../../contributing-a-component.md) and
[`2026-06-29-component-page-design.md`](./2026-06-29-component-page-design.md)):
a `ComponentDoc` front-matter file per component, Compodoc-generated
Properties/snippet maps, and a `docs-shell` that renders Overview /
Properties / Theming tabs from that data.

There is no equivalent for the *services* in `libs/api-clients`
(`isa-data`, `snp-grid`, `ontology`, `asynctask`, `mvar`). Today "Services"
in the left nav is two hardcoded, partially-broken `<a>` tags
(`docs-left-nav.component.ts`) pointing at a legacy `ServiceDocsComponent`
shell with one hand-written page (`ISA Data`) and a dead link
(`/services/isa-data` doesn't match the real route
`/services/docs/isa-data`). `snp-grid`, `ontology`, and `mvar` have zero
real consumers in the demo app today.

This spec covers building the services-docs pattern and proving it out on
**one service: `ontology`** — chosen because, unlike the other unconsumed
services, both of its concrete implementations
(`JaxOntologyService`, `OLSOntologyService`) call real, public, no-auth
backends, so a live demo is genuinely possible without mocks. `isa-data`,
`snp-grid`, `mvar`, and the broken `phenotype` nav placeholder are
explicitly out of scope for this pass.

## Goals

- A `ServiceDoc` front-matter model, analogous to `ComponentDoc`, that
  generalizes to any service — including ones with more than one
  interchangeable implementation (like `ontology`'s Jax/OLS backends) —
  without a special case for "multiple implementations." N implementations
  is just N `usageExamples`; N=1 and N=2 are the same code path.
- A generation-driven **Methods** tab (replacing Properties for services),
  sourced from Compodoc the same way Properties is today, so the method
  list can never drift from the JSDoc'd source.
- A services-docs page for `ontology` with two live usage examples — one
  per implementation — proving both the model and the generation pipeline
  end-to-end.
- Fix the dead `/services/isa-data` nav link as a side effect of making the
  services left-nav data-driven instead of hardcoded.
- No regressions to the just-shipped Components docs system.

## Non-goals

- Migrating `isa-data` off its legacy `ServiceDocsComponent` page.
- Building docs for `snp-grid`, `mvar`, or fixing/building out `phenotype`.
- A generalized `Doc` union type shared between Components and Services
  shells (Approach B from the design discussion) — revisit once 2-3
  services exist and the duplication between `docs-shell` and
  `services-shell` actually hurts.
- Auto-parsing CSS custom properties for theming — moot here since
  services have no Theming tab at all.

## Architecture

**Approach C** (chosen over a fully separate system or a generalized
shared shell): a new `services-shell`, structurally parallel to
`docs-shell`, that reuses the tab-content components already generic
enough to not know about "components" specifically
(`DocOverviewComponent`, `DocUsageComponent`, `DocActivityComponent`), and
forks only what's genuinely different:

- `DocMethodsComponent` — a fork of `DocPropertiesComponent` that renders
  from `service-methods.generated.ts` instead of
  `component-properties.generated.ts`. Same table-of-rows structure, but
  columns are name / signature / return type / description instead of
  name / type / default / required — `default`/`required` are input-specific
  concepts that don't apply to method parameters the same way (params are
  documented inline in the description, matching how the existing JSDoc on
  `JaxOntologyService` already writes them, e.g. `@param query - the search
  query`).
- A small services-left-nav data source (real `ServiceDoc[]`-driven,
  grouped by `category`) replacing the two hardcoded `<a>` tags in
  `docs-left-nav.component.ts`. This is what fixes the dead link — routing
  becomes real (`/services/ontology/overview`,
  `/services/ontology/methods`) instead of guessed.
- **No Theming tab.** `ServiceDoc` has no `theming` field — it isn't part
  of the model, not just hidden by the shell.

`isa-data`'s legacy page and route are untouched. The `services/docs`
legacy route block gains no new children; `ontology` gets its own
top-level `services/ontology/*` block, mirroring how `components/*`
coexists with the shrinking `components/docs/*` legacy block today.

## Data model

New file: `libs/api-clients/src/lib/docs/service-docs.model.ts`.

```ts
export type ServiceCategory = 'Ontology' | 'Data Access' | 'Async Processing' | 'Genomics';

export interface ServiceDoc {
  name: string;
  slug: string;
  category: ServiceCategory;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  /** Short description shown on the Overview header card. */
  description: string;
  docsUrl?: string;
  /** Class Compodoc keys the generated Methods table by — abstract or concrete. */
  compodocSymbol: string;

  /** Overview tab: one example per way of using this service (e.g. per implementation). */
  usageExamples: UsageExampleDoc[];
  /** Overview tab: usage guidance (do / don't panels). */
  usage: UsageDoc;
  /** Overview tab: service activity section. */
  activity?: ActivityDoc;

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

`UsageDoc` and `ActivityDoc` are reused as-is from
`libs/components/src/lib/docs/docs.model.ts` (they're already
domain-agnostic) — re-exported from the new services barrel rather than
duplicated.

### Why no `implementations` field

A multi-implementation service (like `ontology`) is represented purely as
multiple `usageExamples`, distinguished by plain-English `title`/
`description` ("Using JaxOntologyService — hits JAX's own ontology-service
backend" vs "Using OLSOntologyService — hits EBI's public OLS API"). A
separate `implementations: []` array to label this structurally was
considered and rejected: it would duplicate what the example's title
already says, for a UI treatment (e.g. tabs/toggle grouping) nothing in
the current design asks for. If a future service needs that treatment,
add it then.

## Generation — Methods tab

New script `tools/generate-docs-methods.mjs` (sibling to
`generate-docs-properties.mjs`, not a modification of it — the two run
Compodoc against different tsconfigs and read different Compodoc JSON
shapes):

```
TSCONFIG = 'libs/api-clients/tsconfig.lib.json'
OUT_FILE = 'apps/demo/src/app/docs-shell/generated/service-methods.generated.ts'
```

It runs Compodoc the same way (`compodoc -p <tsconfig> -e json -d <tmp>`),
then extracts each class's `methodsClass` (Compodoc's method-documentation
array — the direct analog of `inputsClass`/`outputsClass` used for
Properties) into `ApiMethod[]`, keyed by class name, and writes
`SERVICE_METHODS: Record<string, ApiMethodDoc>`.

**One open verification item for implementation time:** Compodoc
categorizes plain (non-`@Injectable`) abstract classes like
`OntologyService` under a different top-level key than `@Injectable`
services (likely `doc.classes` vs `doc.injectables` — needs confirming
against real Compodoc JSON output for `libs/api-clients`, since this
repo's existing script only ever reads `doc.components`). The generator
must check whichever collection(s) actually contain `OntologyService`
and merge them into one lookup by class name, same as
`generate-docs-properties.mjs` does for `doc.components`.

A new package script `docs:methods` is added alongside `docs:properties`/
`docs:snippets`, and `docs:generate` runs all three.

### JSDoc prerequisite

`OntologyService`'s abstract method declarations
(`ontology.service.base.ts`) currently have no JSDoc — only the concrete
`JaxOntologyService` implementation does. Since the Methods tab documents
the abstract contract (one source of truth for behavior that's supposed
to be identical across implementations), JSDoc is added to the abstract
declarations, mirroring what's already on `JaxOntologyService`:

```ts
export abstract class OntologyService {
  /**
   * Search for terms in an ontology.
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search
   */
  abstract search(query: string, limit: number, ontology: Ontology): Observable<CollectionResponse<OntologyTerm>>;
  // ...same treatment for term, parents, children, ancestors, descendants
}
```

## First entry — `ontologyDoc`

New file `libs/api-clients/src/lib/services/ontology/ontology.docs.ts`,
exported from a new barrel `libs/api-clients/src/docs.ts` (mapped to
`@jax-data-science/service-docs` in `tsconfig.base.json`, mirroring how
`@jax-data-science/component-docs` maps to `libs/components/src/docs.ts`
— intentionally excluded from `index.ts` so docs metadata never ships in
the published `api-clients` bundle, same rule as components).

```ts
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
      description: 'Hits JAX’s own ontology-service backend, configured from a remote JSON config fetched on construction.',
      code: /* inject JaxOntologyService, call .search(...) */,
      language: 'typescript',
    },
    {
      id: 'ols-ontology',
      title: 'Using OLSOntologyService',
      description: 'Hits EBI’s public OLS (Ontology Lookup Service) API directly — no config needed.',
      code: /* inject OLSOntologyService, call .search(...) */,
      language: 'typescript',
    },
  ],
  usage: {
    summary: 'Inject whichever OntologyService implementation matches the backend you need; both honor the same contract.',
    dos: ['Prefer JaxOntologyService for JAX-curated ontology data.', 'Use OLSOntologyService when you need EBI-hosted ontologies not mirrored by JAX.'],
    donts: ['Do not assume paging shape is identical between implementations — OLS-specific paging fields differ from JAX’s.'],
  },
  methods: undefined, // generated map is the real source; no fallback needed once generation is wired up
};
```

(Exact `code` strings are written during implementation, not invented
here — they'll be the real, runnable snippets used in the showcase page,
kept in sync by hand since — unlike component demos — there's no live
Angular template to scrape a snippet from.)

## Showcase page

`apps/demo/src/app/services/pages/ontology/showcase-ontology.component.ts`
(new directory — distinct from the unrelated, in-scope-for-neither-pass
`components/pages/ontology-search/` stub, which stays untouched).

Both usage examples make **real, live HTTP calls** on page load (no mocks,
no auth) and render the actual returned terms in a simple list, proving
the docs page demonstrates genuine behavior:

```ts
export class ShowcaseOntologyComponent implements OnInit {
  private jaxOntology = inject(JaxOntologyService);
  private olsOntology = inject(OLSOntologyService);
  readonly doc = ontologyDoc;

  jaxResults$ = this.jaxOntology.search('fever', 5, Ontology.HP);
  olsResults$ = this.olsOntology.search('fever', 5, Ontology.HP);
}
```

Template renders both result lists under their respective usage-example
sections (via the `async` pipe), plus a visible error state if either
call fails (network hiccups against a real external API are possible —
this is not swallowed silently).

## Shell, routing, nav

- `apps/demo/src/app/services-shell/services-shell.component.ts` — new,
  parallel to `docs-shell.component.ts`. `ALL_SERVICE_DOCS: ServiceDoc[] = [ontologyDoc]`.
- `apps/demo/src/app/services-shell/tab-content/doc-methods/doc-methods.component.ts` — new.
- Left nav: `docs-left-nav.component.ts`'s hardcoded Services block is
  replaced with a data-driven render off `ALL_SERVICE_DOCS`, grouped by
  `category`, same pattern as the Components block already uses for
  `ComponentDoc[]`.
- Routes in `app.routes.ts`:

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

  placed alongside (not replacing) the existing `services/docs` legacy
  block, which keeps serving `isa-data` unchanged.

## Testing

Same verification shape as the Components migration:

- `showcase-ontology.component.spec.ts` — `should create`, mocking both
  `JaxOntologyService` and `OLSOntologyService` with `of(...)` fixtures
  (unit tests don't hit real networks).
- `npx nx build/lint/test` for both `api-clients` and `demo`.
- A live browser check (Playwright, as used for the Components
  verification) confirming both usage examples return real, non-empty
  search results, the Methods tab lists all 6 methods with descriptions,
  and the left nav shows "Ontology Service" under a real route.

## Open risk

The Compodoc `doc.classes` vs `doc.injectables` question above is the one
piece of this design not yet empirically confirmed — flagged so the
implementation plan verifies it early (first task) rather than assuming
and discovering a mismatch late.
