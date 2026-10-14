# Term Browser (IS-856) — Design

## Context

HPO needs a term browser for its left-bar navigation: a view of where an
ontology term sits in the hierarchy, and a way to walk that hierarchy. It was
designed in [HPO-199](https://jacksonlaboratory.atlassian.net/browse/HPO-199)
(Done) and must be built as a **generic, ontology-agnostic** component in this
toolkit, then released so HPO can consume it via
[HPO-203](https://jacksonlaboratory.atlassian.net/browse/HPO-203) — the same
IS-669 -> HPO-136 path the autocomplete component took.

Two views, switched by one boolean toggle:

- **Immediate view** ([Figma 447-964](https://www.figma.com/design/YS0wExLoH5cGTYMviEnIjw/HPO_Shareable?node-id=447-964))
  — the focused term with any number of parents above it and its immediate
  children below. Flat; no expand/collapse.
- **Full tree view** ([Figma 447-893](https://www.figma.com/design/YS0wExLoH5cGTYMviEnIjw/HPO_Shareable?node-id=447-893))
  — every distinct root-to-term path merged into one indented tree, with
  collapsed siblings alongside the expanded spine.

`libs/components` has nothing tree-, accordion- or expansion-shaped today, and
PrimeNG's `TreeModule` is installed but unused everywhere in the workspace, so
this is the library's first tree component.

**Terminology.** The number rendered on each row is the **descendant count** —
transitive subtree size. The ticket's wording ("child counts") is loose; both
the design and the data are descendants. `All (19,835)` is roughly the size of
HPO; `Hypertension (7)` has six direct children. A separate `childCount` exists
only to label a "Show N more" row when a sibling list is capped.

## Goals

- A `JdsTermBrowserComponent` that is genuinely ontology-agnostic: consumers
  supply term id, label, and hierarchy resolution. No HPO-specific types, no
  endpoints, and no `OntologyService` dependency inside the component.
- Both views, matching Figma for color, icon and metric; a toggle between them;
  descendant counts on every non-leaf row.
- Server-side path merging, so the UI library contains no graph algorithms and
  the browser makes one request instead of a traversal storm.
- WCAG 2.2 AA, including the criteria new in 2.2 (2.4.11, 2.5.8) — a step change
  from the library's current accessibility ceiling, deliberately.
- Responsive down to HPO's real 284px left rail, not just the 420px mock.
- Released from the toolkit so HPO can consume it.

## Out of scope

- Merging search into the component. HPO-199 raised it as an open question and
  it is deferred to its own ticket.
- Parent counts. Listed as "consider" in HPO-199; deferred.
- Any HPO-side integration work, which is HPO-203.

## Confirmed design spec

Pulled from both Figma nodes via the Figma MCP. Every color maps to a primitive
in `libs/themes/src/lib/echo/primitive.ts` except one, noted below.

### Shell

| Element | Spec |
|---|---|
| Card | `w-420`, bg `var(--surface/0, #fff)`, `pt-24 px-24 pb-32`, `gap-12` |
| Header row | `flex justify-between items-center`, `pb-12` |
| Title | "Term Browser" — Source Sans Pro **Bold** 16/24, `#1e293b` (off-palette) |
| Toggle label | "View full tree" — Regular 13px, `#454545` = `grey-800`, `gap-12` |
| Switch | PrimeNG **ToggleSwitch**, 32x20, radius 16, handle 12px white, inset 4. On `#0177b2` = `cyan-700`; off `#bcbcbc` = `grey-400` |
| List | `flex-col gap-2` |

### Rows

| Element | Spec |
|---|---|
| Row | `flex items-center gap-8`, `py-6`, `pr-16`, `pl = 16 * level` |
| Chevron | 16x16 container, 10x10 glyph |
| Leaf | 16x16 spacer, so labels stay aligned with their siblings |
| Label | 14px; term name `#222` = `grey-900`; count `#454545` = `grey-800` |
| Count | ` (19,835)` — parenthesised, thousands-separated, **omitted on leaves** |
| Focused row | bg `#94e1dc` = **`teal-300`**, `rounded-6`, label **Bold**, `#16191d` = `slate-900` |
| Hover | **underline** on the term label |

Collapsed chevrons appear two ways in the Figma file — a `chevron-right` asset,
and a `chevron-down` rotated -90deg. Implement as one chevron rotated, which is
also what makes a CSS transition possible.

The immediate view uses the same shell, but its rows are plain text: no
chevrons, no spacers, no expand/collapse.

### Deviations from the mock

Three, each deliberate.

1. **Support N parents in the immediate view.** The mock shows one parent above
   the focused term, but the full view of the same term shows it reached by two
   different parents. The ticket's acceptance criteria say "any number of
   parents," so parents stack above the focus.

2. **Indentation must be responsive.** The mock is a 420px card; HPO's left rail
   is 284px (`hpo-web` hardcodes `lg:w-[284px]`). At a flat 16px per level, a
   depth-12 term needs 192px of indent inside 284px, leaving nothing for the
   label. So indent is a CSS custom property that steps down at narrow widths,
   and the immediate view indents *relative* (0/16/32) rather than the mock's
   absolute `pl-48/64/80` — absolute depth there spends 80px to convey nothing,
   since only the parent/focus/child relationship matters in that view.

3. **The keyboard focus ring moves to the row.** The mock rings the chevron, but
   the row is what receives focus in a `role="tree"`, so a ring on the twisty
   would leave the real focus target unindicated and fail 2.4.7. The row gets
   the ring; the mock's treatment becomes the twisty's hover affordance.

## The merge rule

The full tree view renders *paths* through the ontology DAG, merged on shared
prefix:

> Two rendered positions are the same node **iff their entire root-prefix is
> identical.**

So the shared root chain appears once, the tree forks where routes diverge, and
a term reachable by N distinct routes appears **N times**, each occurrence
carrying its own copy of its subtree. Along those paths, every spine node's
*other* children appear as collapsed siblings the user can expand.

The Figma full-view mock is exactly this: `All` and `Abnormality of the
cardiovascular system` each appear once, while `Hypertension` appears twice with
its whole child list repeated, because the two routes to it diverge upstream.

Merging by term id instead would be wrong — it detaches a term from both its
parents and reparents it, fabricating an edge that does not exist in the
ontology and destroying the "which route did I take" information that is the
entire point of the view.

**Node identity is therefore the path, not the term id.** The canonical key for
a position is the `/`-joined CURIE path from the root, which makes the merge rule
literal string equality and testable with string operations.

## Architecture

Three layers, each with one job:

```
ontology-service (backend)   enumerate paths, merge on prefix, attach siblings
        |
libs/api-clients             OntologyService.tree(id, options) -> typed model
        |
libs/components              JdsTermBrowserComponent renders it; lazy children
```

### Why the merge is server-side

The transform is required by the design, but nothing requires the browser to
compute it.

- **One request instead of a traversal storm.** `ancestors()` returns a flat,
  unordered ancestor set with **no edge information**, so root-to-term paths can
  only be derived by walking `parents()` transitively — roughly 50+ requests for
  a deep polyhierarchical term, repeated in every session.
- **The answer is identical for every user.** The merge is a pure function of the
  ontology version, so it caches once on the server rather than being recomputed
  per browser.
- **The backend already has the closure.** `descendantCount` is computed at
  ingest (`DataInitializer` persists `graphService.getDescendantCount(...)`) and
  is already serialized on `/parents`, `/children`, `/ancestors`, `/descendants`.
  The Angular client currently discards it. The count the design needs is free.
- **The UI library stays free of graph algorithms**, which is the right shape for
  a published component library.

### Lazy expansion needs no new endpoint

A term's children do not depend on the path taken to reach it. So expanding a
collapsed sibling reuses the existing `children()` call, and the client mints the
child's key itself as `parentKey + '/' + childCurie`. The new endpoint exists
*only* because path enumeration and prefix merging must be server-side.

## Endpoint contract

```
GET /api/{ontology}/terms/{id}/tree
```

| param | default | max | meaning |
|---|---|---|---|
| `siblings` | `true` | — | include each spine node's other children, collapsed |
| `childDepth` | `1` | `3` | expanded depth below the focused term |
| `maxPaths` | `50` | `500` | cap on distinct root-to-focus paths |
| `maxSiblings` | `100` | `1000` | cap on included children per node |
| `lang` | `en` | — | Babelon label language |
| `v` | absent | — | pin to an ontology version, for immutable caching |

Out-of-range values return `400` rather than clamping silently — a silent clamp
makes the `truncated` flags misattribute the cause.

### Shape: flat pre-order nodes plus a term dictionary

```jsonc
{
  "ontology": "hp",
  "ontologyVersion": "2025-05-06",
  "focus": { "requestedId": "HP:0001166", "id": "HP:0001166",
             "resolution": "active", "replacedBy": null, "nodes": [12, 27, 41] },
  "disconnected": false,
  "truncated": { "paths": false, "siblings": false, "nodes": false,
                 "totalPaths": 8, "totalPathsExact": true, "includedPaths": 8 },
  "warnings": [],
  "nodes": [
    { "term": "HP:0000001", "parent": null, "childState": "expanded" },
    { "term": "HP:0000118", "parent": 0,    "childState": "partial" },
    { "term": "HP:0040064", "parent": 1,    "childState": "collapsed" }
  ],
  "terms": {
    "HP:0000001": { "name": "All", "descendantCount": 19835, "childCount": 7,  "obsolete": false },
    "HP:0000118": { "name": "Phenotypic abnormality", "descendantCount": 19821, "childCount": 23, "obsolete": false }
  }
}
```

Chosen over a nested `children[]` tree, and over a flat list of paths, because:

- **Position addressability is the feature.** A nested tree has no position
  identity — you would address positions by array-index path (fragile across
  requests) or add a synthetic id to every node anyway. Once every node needs an
  id, nesting buys nothing.
- **Nesting duplicates term payloads.** `HP:0100229` is 1,014 positions over 279
  distinct terms, so a nested tree carries every label and count about 3.6 times,
  and lets two copies of one term drift to different `descendantCount`s. The
  normalized shape makes that unrepresentable.
- **A flat list of paths does not express the merge at all** — it pushes the
  merge onto every client, and there is nowhere to hang collapsed siblings, which
  belong to a position rather than to a path.
- **Precedent:** OLS4's v1 `/jstree` uses this structure (flat array,
  path-derived id, parent pointer). We keep the structure and drop its base64
  ids, which are undebuggable in fixtures and bug reports.

`parent` is an integer index rather than the path string: about 48 bytes per node
against about 250 for path strings carried twice. The path key is a documented
pure function of the payload that the client derives in one O(n) pass, relying on
the pre-order guarantee.

### `childState` has four values, not three

`none` | `collapsed` | `partial` | `expanded`

The common `hasChildren: boolean` plus `children: []` design **cannot
distinguish `collapsed` from `none`** — the most frequent bug in tree APIs.
`partial` covers a sibling list truncated by `maxSiblings`, which a three-state
enum forces the server to lie about; it drives a "Show 2,912 more" row.

It stays on the wire even though it is derivable, so the server remains the
single authority on what it actually sent: a `childCount` left stale by a partial
reingest would otherwise render a "Show 1 more" button that returns nothing.

### Invariants

- `nodes` is **pre-order DFS**: `nodes[i].parent < i` always, `null` only for
  roots. This is what makes key and depth derivation a single pass.
- **A spine child is always included regardless of `maxSiblings`.**
  `HP:0000118 Phenotypic abnormality` sorts 23rd among `All`'s children but must
  survive any cap, or the tree disconnects. This is the subtlest requirement in
  the contract.
- `terms` has an entry for every distinct `nodes[].term`, and no extras.
- `nodes` is never empty for a resolvable id.
- `descendantCount` is `0` for leaves — never omitted, never `null`. The service
  runs `micronaut.serde.serialization.inclusion: ALWAYS`, so absence cannot carry
  meaning anyway; suppressing the count is a render rule.
- Counts and edges come from **one graph**, or a node claims 7 descendants while
  showing 9 children.
- Sibling order is `name` case-insensitive ascending, ties by CURIE. This matches
  the existing `unpack()` sort and must be deterministic for cacheability across
  the service's five instances.

### Edge cases: `200` with a flag, not an error

| Case | Response |
|---|---|
| Focus is a root | `nodes[0].parent === null`, `focus.nodes === [0]`, no sibling rows — do not dump the other roots |
| Obsolete, has `replaced_by` | `resolution: "replaced"`, `requestedId != id`, tree is the replacement's. **Not a `301`** — a redirect destroys the requested id inside `HttpClient` and breaks SPA routing |
| Obsolete, detached | `resolution: "obsolete"`, `disconnected: true`, `totalPaths: 0`, one node |
| Active but unrooted | `disconnected: true`, `resolution: "active"`, focus plus children |
| Cycle | Acyclic paths returned plus `warnings: [CYCLE_DETECTED]`. One bad branch must not blank the browser |
| Unknown or malformed id | `400 MALFORMED_ID` / `404 TERM_NOT_FOUND` / `404 WRONG_ONTOLOGY`, each with a JSON body carrying a `code` |

A real term the user navigated to must never render as "not found."

Today's error behaviour is unusable from a browser client and must be fixed for
this route: `HP:9999999` returns `404` with `Content-Type: text/html` and a
zero-length body; `MONDO:0005015` on `/api/hp` is indistinguishable from
not-found; a prefix-less id returns Micronaut HATEOAS under
`_embedded.errors[0].message`, which does not match this repo's `BaseResponse`;
and an unknown *ontology* never reaches the app at all, so the gateway serves the
docs-site HTML in response to a JSON call.

**Path counts in a DAG are exponential.** `totalPaths` needs a memoized DP with
saturating arithmetic capped at 1,000,000 plus `totalPathsExact: false`, or a
malformed ontology overflows or hangs the request. A hard internal `maxDepth` of
64 backs it up; the deepest observed real path is 14.

### Size and caching

A node costs about 48 bytes, a term about 100. The worst realistic HPO payload is
about 80KB uncompressed, 10KB brotli (`HP:0100229`, 1,014 nodes). `siblings=false`
drops roughly 90% of nodes and is the right knob for compact rendering, better
than lowering `maxSiblings`. A server-side ceiling of `maxNodes=3000` applies,
with a deterministic drop order (deepest, then widest, then CURIE) —
nondeterminism would break CDN correctness. MONDO is the real size risk, not HPO.

```
Cache-Control: public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400
ETag: "hp-0.5.20/2025-05-06/babelon-9f3c1a/en/HP:0001166/s1d1p50b100"
Vary: Accept-Encoding
```

There are zero cache headers on the service today. The ETag must include four
things, three of them easy to miss:

1. Ontology version.
2. **Service version** — a phenol upgrade can change which relations count as
   hierarchical, silently changing both edges and counts on identical data.
3. **Babelon translation digest** — HP is `international: true`, and because
   siblings sort by *name*, a translation refresh changes the tree's
   **structure**, not merely its text.
4. Every query parameter, including `lang`.

`?v=` matching the loaded version returns `max-age=31536000, immutable`; not
matching returns `409 VERSION_MISMATCH` with `currentVersion`, so a long-lived
tab cannot render counts from one release against a tree from another.

Do not precompute every tree — 19,836 terms at up to 80KB is about 1.5GB. Cache
the **path enumeration** per term, which is tiny and is the expensive part, then
merge and assemble per request. Note `max_instances: 5`: in-process caches are
per-instance and cold on scale-out, so lean on the CDN and the ETag.

## Client surface

New in `libs/api-clients`:

- `OntologyService.tree(id, options?)` — abstract, with the JSDoc on the abstract
  declaration per `docs/contributing-a-service.md`, since the docs Methods table
  generates from the abstract class rather than the implementations.
- Models: `OntologyHierarchyTree`, `OntologyTreeNode`, `OntologyTermSummary`,
  `OntologyTreeFocus`, `OntologyTreeTruncation`, `OntologyTreeWarning`,
  `OntologyTreeChildState`, `OntologyTreeOptions`, `OntologyTreeRow`.
- `ontologyTreeRows(tree)` in `ontology.shared.ts` — derives key, depth,
  `includedChildCount` and `isFocus` in one O(n) pass off the pre-order
  guarantee. Specified in the shared module so client and server cannot disagree
  on key derivation.
- `descendantCountSuffix(count)` — the design's ` (19,835)` / empty-for-leaf rule
  in one place.
- `OntologyTerm.descendantCount?: number`, **populated by both
  implementations** (`olsTerm.numDescendants` in the OLS mapper), so it is
  optional only for tolerance of an older server and never "depends which
  implementation you injected." Lazy sibling expansion needs it: rows fetched via
  `children()` must render their own counts.
- `libs/api-clients/src/index.ts` must gain
  `export * from './lib/services/ontology/ontology.shared';` — it is not exported
  today, so the helpers would be unreachable from consumers.

`hasChildren` is deliberately **not** added to `OntologyTerm`:
`descendantCount > 0` already implies it, and the boolean would invite confusion
with the position-scoped `childState`.

### OLS4 cannot serve this shape

`OLSOntologyService.tree()` returns `throwError` with an explanatory message.
Its v1 `/jstree` returns a single root path — seven nodes in a chain for
Hypertension — with `"children": false` on every node, so no leaf/collapsed
distinction, no descendant counts, no focus marker, and base64 ids. Rebuilding
the merge from v2 `directParent` would be roughly 37 sequential requests for
`HP:0001166` and 60+ for `HP:0100229`, **and would silently drop routes**,
because `parents()`/`ancestors()` in that file already emit `""` placeholders
that get filtered out when `linkedEntities` lacks an entry. A tree missing routes
is worse than no tree, since the feature's entire claim is "here is every route
to this term."

`throwError`, never a synchronous `throw` — a synchronous throw from a service
method fails during component construction rather than reaching the subscriber.

## Component surface

`JdsTermBrowserComponent`, selector `lib-jds-term-browser`, standalone, in
`libs/components/src/lib/term-browser/`.

```ts
term             = model<JdsTerm | null>(null);       // two-way; composes with JdsAutocompleteComponent
tree             = model<JdsTermTreeNode[]>([]);      // pre-merged, from OntologyService.tree()
parents          = model<JdsTerm[]>([]);              // immediate view, above the focus
children         = model<JdsTerm[]>([]);              // immediate view, below the focus
childrenResolver = input.required<JdsTermResolver>(); // lazy expand; reuses children()
fullTree         = model(false);                      // the switch; emits fullTreeChange for free
showToggle       = model(true);
showCounts       = model(true);
maxHeight        = model('480px');
reFocusOnSelect  = model(false);
title            = model('Term Browser');
ariaLabel        = model('Ontology term hierarchy');
labels           = model<Partial<JdsTermBrowserLabels>>({});

termSelect = output<JdsTermSelectEvent>();   // { term, path }
expandTerm = output<JdsTermExpandEvent>();
toggleView = output<boolean>();              // consumer fetches the tree on first switch
loadError  = output<JdsTermBrowserError>();
```

`input.required()` for `childrenResolver` diverges from the all-`model()`
precedent set by `JdsAutocompleteComponent` deliberately: it is a function never
written back, and lazy expansion is broken without it, so a compile-time error
beats a silently dead twisty.

Encapsulation is **emulated**, unlike `JdsAutocompleteComponent`'s
`ViewEncapsulation.None`. Nothing is appended to `body` here, so `:host` works
and the component's tokens stay scoped.

### Click behaviour

The twisty toggles children. Clicking the term emits `termSelect` and highlights
the row; it does **not** re-root the tree. HPO routes to its own term page and
pushes a new `[term]` back in, keeping the URL the source of truth. Re-rooting
stays available as an opt-in `reFocusOnSelect`, defaulting to `false`.

### Accessibility

**Full tree** — `role="tree"` with **flat DOM rows** carrying `aria-level`,
`aria-posinset` and `aria-setsize`, plus roving tabindex. Flat-DOM trees are
explicitly sanctioned by ARIA and are what the VS Code and GitHub file trees do;
they give O(1) keyboard navigation and guarantee DOM order matches visual order
(2.4.3). `aria-selected` keys off **term id**, so every position of the focused
term reads as selected — the truthful answer to "where am I in this DAG."

**Immediate view** — native `<nav aria-labelledby>` plus `<h3>` plus a `<ul>` of
buttons. Parents-above-focus is flat navigation, not a hierarchy; `role="tree"`
there would announce a nesting depth that does not exist, and there is no correct
place for the group headings inside a tree. Tab moves between buttons, which is
right for a roughly ten-item list and needs no custom keyboard code.

| Key | Behaviour |
|---|---|
| Down / Up | Next / previous visible row. No wrap |
| Right | Collapsed -> expand (lazy resolve). Expanded -> first child. Leaf -> no-op |
| Left | Expanded -> collapse. Otherwise -> parent row |
| Home / End | First / last visible row |
| Enter / Space | Emit `termSelect`. `Space` must `preventDefault` or the scroller jumps |
| `*` | Expand all siblings of the current row |
| printable | Typeahead, 500ms buffer |

The twisty is a non-focusable `aria-hidden` span, not a nested `<button>`: a
button inside a composite widget gets double-announced and duplicates the
`aria-expanded` state that belongs on the `treeitem`. It still needs a 24x24
target for 2.5.8. `aria-expanded` is **omitted** (`null`) for leaves, never
`false`.

WCAG 2.2 criteria specifically in play:

- **2.4.11 Focus Not Obscured (new in 2.2)** — the live risk, since the tree is a
  scroll container. The toggle sits above the scroller and is never sticky inside
  it; every keyboard focus move calls `scrollIntoView({ block: 'nearest' })`; and
  `scroll-padding-block: 2.25rem` keeps a future sticky element from clipping a
  focused row.
- **2.5.8 Target Size (new in 2.2)** — the row and the twisty are two targets in
  one row, so each needs 24x24 independently: row `min-height: 36px`, twisty
  24x24, enforced in CSS rather than left to Tailwind utilities.
- **1.4.3 / 1.4.11** — label `#222` on white is 15.9:1; count `grey-800` on white
  is 8.9:1; chevron `grey-800` clears 3:1. All verified against `primitive.ts`.
- **2.1.2 No Keyboard Trap** — roving tabindex makes the tree a single tab stop,
  so Tab always leaves it.
- **4.1.3 Status Messages** — `role="status" aria-live="polite"` announces
  loading, counts loaded, view switches and resolver failures; `aria-busy` marks
  the loading row.

This is well past the library's current ceiling
(`facet-search.component.html:65-76`: `role="button"` plus `keyup.enter`/
`keyup.space` plus `tabindex="0"`). Note the bug there that is not repeated:
`keyup.space` on a non-button scrolls the page on `keydown` before the handler
ever fires. This component binds `keydown`.

### i18n

Two separate problems, and conflating them would be a mistake.

**Term labels** need nothing from the component. `hpo-web` translates term names
and definitions per record (a 14-language `Translation[]` selected by a 4-argument
pipe, including long-tail languages like `nna` Nyangumarta and `dtp` Kadazan
Dusun), and the consumer's resolver already returns `JdsTerm.label`. HPO picks
the translated label at the boundary, which keeps the component free of any
language concept.

**Chrome strings** are the component's problem. `libs/components` is published, so
it must not hard-depend on a consuming app's translation setup — and `hpo-web`
has **no UI-string i18n at all** to depend on: no library, no catalogs, no keys,
no plurals. Its one library-shaped component, `HierarchyTreeComponent`, takes the
language as an `@Input` and injects nothing, and its own chrome text is hardcoded
English. So a `labels` input with English defaults, spread-merged so partial
overrides work, is strictly additive over what exists.

The count text is typed as a function rather than a string:

```ts
childCount: (n: number) => string;   // default: n === 0 ? 'no children' : n === 1 ? '1 child' : `${n} children`
```

A consumer with real i18n passes its own function and gets correct plural rules,
including languages with more than two plural forms, which a `{one, other}`
string pair cannot express.

## Prerequisite: `JaxOntologyService` config rework

`JaxOntologyService` cannot make a single successful request today, and the cause
is the shape of its config loading rather than a wrong URL string. Each of these
was verified directly:

1. `ontology.service.jax.ts:16` points `config_location` at
   `config/ontologies-internal.json`, which returns **HTTP 404** — only
   `config/ontologies.json` exists. The constructor's error handler sets
   `this.config = []` (`:26-28`), and `ontologyBaseResolver` throws
   `'No ontology configuration found.'` whenever config is empty (`:111-113`), so
   every method throws.
2. All five methods build `${base}/${id}` (`:48`, `:61`, `:74`, `:87`, `:100`),
   but `api.base` for `hp` is `https://ontology.jax.org/api/hp` and the terms
   endpoint is `.../api/hp/terms/{id}` — as `hpo-web` does in production. The
   `/terms` segment is missing everywhere.
3. `config/ontologies.json` has no `cl` entry (only hp, mp, mondo, maxo), so
   `Ontology.CL` cannot resolve a base URL.
4. `term()` is typed `Response<OntologyTerm>` but never unwraps (`:46-49`); the
   service returns a bare object.

CI does not catch any of this: `ontology.service.jax.spec.ts` flushes a *fake*
config (`:141-156`) and asserts `${testOntologyConfig[0].api.base}/${id}`
(`:73`), mocking away the real config and encoding the buggy URL shape, while
`flushBrokenConfig` (`:164-168`) asserts the `'No ontology configuration found.'`
throw as *expected* behaviour — precisely what production hits on every call.

The design problems to fix, not just the symptoms:

| Problem | Why it bites |
|---|---|
| Config fetched in the constructor via `.subscribe()` | A fire-and-forget side effect nothing can await, so every call races it |
| `private config!: OntologyConfig[]` | The definite-assignment assertion is untrue for the service's first moments |
| `ontologyBaseResolver` throws synchronously | Fails during component construction rather than reaching the subscriber. `docs/contributing-a-service.md:277-286` documents this hazard and prescribes `defer()` |
| Config URL is a hardcoded public field | Not overridable per environment or in tests, despite an established token pattern in `libs/api-clients/src/lib/tokens/` |
| Transport errors swallowed to `[]` | Indistinguishable from a genuinely empty config, with no retry |
| `/terms` would repeat across five methods | The base URL is not a single source of truth |

The rework adopts the injection-token pattern the repo already uses for
`isa-data`, `mvar` and `snp-grid`, plus a lazily-resolved shared stream in place
of constructor state:

```ts
export const ONTOLOGY_CONFIG_URL = new InjectionToken<string>('ONTOLOGY_CONFIG_URL', {
  factory: () =>
    'https://raw.githubusercontent.com/TheJacksonLaboratory/ontology-service/refs/heads/main/config/ontologies.json',
});
```

```ts
private config$ = this.http.get<OntologyConfig[]>(this.configUrl).pipe(
  retry({ count: 2, delay: 500 }),
  map((configs) => new Map(configs.map((c) => [c.prefix.toUpperCase(), c]))),
  shareReplay({ bufferSize: 1, refCount: false }),
);

private termsBase$(ontology: Ontology | undefined): Observable<string> {
  if (!ontology) {
    return throwError(() => new OntologyConfigError('Unrecognized ontology prefix.'));
  }
  return this.config$.pipe(
    map((byPrefix) => {
      const config = byPrefix.get(ontology);
      if (!config) {
        throw new OntologyConfigError(`Ontology '${ontology}' is not in the service configuration.`);
      }
      return `${config.api.base}/terms`;   // the one place this segment lives
    }),
  );
}
```

Each method then composes off that stream with `switchMap`, so the race
disappears, errors reach the subscriber typed, transient failures retry, the URL
is overridable, and `/terms` exists once. `refCount: false` is required —
`refCount: true` would re-fetch every time the subscriber count hit zero, which
is every component destruction.

The spec must be reworked rather than extended: provide the URL through the
token, assert against a realistic base
(`https://ontology.jax.org/api/hp/terms/HP:0000001`) so a missing-segment
regression fails, prove config is fetched once across several calls, prove a
config 404 surfaces as an `OntologyConfigError` to the subscriber, and delete the
assertion that throwing is correct behaviour.

## Sequencing

1. **`JaxOntologyService` config rework** — hard prerequisite. Until config
   loading works, no JAX method can be verified against a real server, `tree()`
   included.
2. **Backend `/tree` endpoint** — companion ticket in
   `TheJacksonLaboratory/ontology-service`.
3. **`api-clients` client method** — waits until the endpoint is on dev. The
   models, both implementations and the specs land once there is a real response
   to verify against, not against a paper contract.
4. **`libs/components` component and demo** — depends on step 3 only for live
   verification; its own tests and demo run entirely on fixtures.

## Demo and fixtures

The demo page lives at
`apps/demo/src/app/components/pages/term-browser/showcase-term-browser.component.{ts,html}`,
following the established shape: four `app-doc-*` tags, one `<ng-template>` per
variation with `<!-- snippet:id -->` markers around only the component usage, and
`@ViewChild` refs collected into `demoTemplates` in `ngAfterViewInit()` followed
by `cdr.detectChanges()`. The directory name must equal the slug and the template
must be `showcase-term-browser.component.html`, or
`tools/generate-docs-snippets.mjs` finds no markers.

| Variation | Demonstrates |
|---|---|
| `immediate` | Default. Parent(s) -> focus -> children, no chevrons |
| `full-tree` | The merged tree with the focus at several positions and collapsed siblings |
| `multi-parent` | Immediate view with three parents stacked — the criterion the mock does not draw |
| `lazy-loading` | `delay(600)` resolvers; one throws, showing the retry row, `aria-busy` and the live region |
| `narrow` | Rendered at HPO's real 284px rail width, showing the indent step-down at depth |

**The fixture is `HP:0001166` Arachnodactyly** — 8 real root paths, depth 10, 312
positions over 160 distinct terms.

The Figma's own example is **not reproducible** against current HPO:
`HP:0000822 Hypertension` is monohierarchical today (one root path, depth 6), so
the mock's two-occurrence fork does not exist in the data. The mock also elides
`HP:0000118 Phenotypic abnormality` (the real edge is
`HP:0000118 -> HP:0040064`, not `All -> Abnormality of limbs`), shows five of
Hypertension's six real children, and carries counts from an older release
(19,893 / 1,506 / 3,023 against live 19,835 / 1,504 / 3,009). Several children do
map to real CURIEs, so it was drawn from a real earlier response.

Polyhierarchy is abundantly real, so this does not weaken the feature:

| Term | Root paths | Depth | Total nodes | Distinct terms |
|---|---|---|---|---|
| `HP:0000822` Hypertension | 1 | 6 | 71 | 71 |
| `HP:0001166` Arachnodactyly | 8 | 10 | 312 | 160 |
| `HP:0100425` | 48 | 12 | 946 | 278 |
| `HP:0100229` | 36 | 14 | 1,014 | 279 |

Across a 40-term sample: median 2 root paths, p90 of 7, maximum 48, maximum depth
14. The hot spots are the neoplasm terms, cross-classified by site and histology.

Arachnodactyly reproduces the mock's *structure* with data that genuinely forks.
A trimmed subtree keeps the demo readable, and a code comment records which
release the counts came from.

## Testing

Commands:

```bash
npx nx lint api-clients && npx nx test api-clients && npx nx build api-clients
npx nx lint components && npx nx test components && npx nx build components
pnpm docs:generate && git diff --stat apps/demo/src/app/docs-shell/generated/
npx nx lint demo && npx nx test demo && npx nx build demo
pnpm start     # -> /components/term-browser/overview
```

Unit tests, which are a new precedent for `libs/components` — `libs/api-clients`
already has service specs, but the autocomplete component deliberately shipped
without any, on the grounds that its logic was trivial. The flatten and key
derivation logic here is not trivial:

- `term-browser.flatten.spec.ts` — levels, `posInSet`/`setSize`, a duplicated
  term at two positions receiving distinct keys, leaf against
  collapsed-with-children.
- `term-browser.component.spec.ts` — input defaults, `setInput` for `term` and
  `fullTree`, expand and collapse, the view toggle, keyboard navigation, a
  resolver error producing a retry row, and `aria-expanded` **absent** on leaves.

Manual gates the build cannot cover:

1. **Side by side with Figma** at 420px — row padding, 16px indent, `teal-300`
   selection, parenthesised thousands-separated counts, counts absent on leaves.
2. **At 284px** (HPO's rail) and at 320px and 200% zoom — no horizontal scroll,
   labels legible at depth 8 and beyond.
3. **Docs integrity** — every variation shows a live demo *and* a matching
   non-empty code block (an empty block means a marker or id mismatch); the
   Properties table has prose for every member (an empty description means the
   JSDoc landed on the class rather than the member); the component appears in
   the left nav under Data Display.
4. **Keyboard only, mouse unplugged** — Tab into the tree lands on exactly one
   row; the full key table works; Tab exits in one press; focus never lands on a
   row clipped at a scroll edge; focus is never stolen on page load.
5. **Screen reader** — VoiceOver with Safari and NVDA with Firefox: level,
   position and set size announced on the flat tree; a leaf announces **no**
   expanded state; counts heard once rather than twice; the live region fires on
   expand, error and toggle.
6. **axe DevTools** — zero violations in both views, focused and expanded.
7. **Against the real endpoint**, once it ships — focus `HP:0001166` and confirm
   the rendered tree matches the contract: shared prefix once, focus at every
   occurrence, siblings collapsed.

## Open questions

1. **Does the tree hide "organizational" layers** like
   `HP:0000118 Phenotypic abnormality`? The Figma mock elides it.
   Recommendation: **no** — keep the endpoint a faithful projection of the graph
   and do any elision client-side with a per-ontology skip list, so responses
   stay cacheable and testable.
2. **Is the mock's partial sibling list shorthand or a rule?** It shows 2 of
   `HP:0001626`'s 4 children and 1 of `HP:0000118`'s 23. Planned as shorthand —
   all siblings, up to the cap.
3. **`#1e293b` for the card title is off-palette** — that is Tailwind's
   `slate-800`, not echo's `#2e353d`. Confirm with design rather than silently
   substituting.
4. **Code Connect has no counterpart for the toggle.** Figma carries a
   `toggleswitch` component (`447:874`) but `libs/components` has no
   toggle/switch wrapper. Either wrap `p-toggleswitch` as a JDS component and map
   it, or accept the gap.
