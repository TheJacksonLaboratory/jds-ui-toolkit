# Component Documentation Page System — Design Spec

**Date:** 2026-06-29 (revised 2026-07-02 against actual Figma design)  
**Ticket:** IS-585 (design) / IS-562 (implementation story)  
**Design:** [Components-and-Documentation](https://www.figma.com/design/xIz1scHUqflk0N9SGbLOvK/Components-and-Documentation?node-id=2663-552)  
**Status:** Implemented for the progress-widget pilot (stages 1 + 2); rollout to remaining components pending

---

## Problem

The demo app (`apps/demo`) has a component showcase system that is not scalable. The current `ComponentDocsComponent` acts as a god object — all metadata is hardcoded in one file, navigation lives in the top navbar, and there is no consistent structure for displaying variations, usage guidance, or API documentation. Adding a new component requires knowing to update multiple disconnected files.

---

## ⚠️ Correction from original plan

The original spec defined four tabs — **Overview / Variations / Usage / API** — and built them as separate routes (implemented that way in IS-562). **This does not match the design.** The design has:

- **Tabs:** Overview · Properties · Theming
- **Variations, Usage, and Component Activity are *sections inside the Overview tab*** (one scrolling page), not tabs.
- **Properties** replaces the old "API" tab.
- **Theming** is new — per-component overridable CSS variables.

IS-562's 4-tab routing must be restructured to match this. See Reference Implementation.

---

## Goals

- Flexible, extensible docs system for all components in `libs/components`
- Layout matches the approved design: left nav | scrolling content | right "On this page" TOC
- **Content generated from source of truth, not hand-maintained** — Properties from JSDoc (Compodoc), code snippets extracted from the live demo templates. Prose is short structured front-matter (no markdown — the design has no long-form prose).
- Consistent page structure across all components
- Adding a component requires config + content only, no layout HTML edits (IS-562 scalability AC)

---

## Layout (from design)

Three columns inside the shell, below the top navbar:

```
┌─────────────┬──────────────────────────────────────┬──────────────────┐
│ Left nav    │  Tabs: Overview · Properties ·        │  On this page    │
│ (240px)     │        Theming                        │  (220px)         │
│ PanelMenu   │  ┌────────────────────────────────┐   │  PanelMenu TOC   │
│ grouped by  │  │ Header card: name, description, │   │  · Summary       │
│ category    │  │ tags (status/auth/contact)      │   │  · <variation>   │
│             │  ├────────────────────────────────┤   │  · <variation>   │
│ Navigation  │  │ Overview body (scrolls):        │   │  · Usage         │
│  Nav Bar    │  │  • Variation sections           │   │  · Component     │
│ Input       │  │      title + anchor icon        │   │    Activity      │
│  Facet …    │  │      description                │   │                  │
│  Ontology…  │  │      live demo box              │   │ [Download        │
│ Messaging   │  │      code block (some)          │   │  Vignette]       │
│  Error …    │  │  • Usage section                │   │                  │
│ Data Display│  │      do / don't panels          │   │                  │
│  Async …    │  │  • Component Activity section    │   │                  │
│  Schema …   │  └────────────────────────────────┘   │                  │
│ Utilities   │                                        │                  │
│  Auth …     │                                        │                  │
│  Progress…  │                                        │                  │
│ [Help & Doc]│                                        │                  │
└─────────────┴──────────────────────────────────────┴──────────────────┘
```

### Left nav (`DocsLeftNavComponent`)
- PrimeNG `PanelMenu`, 240px, sticky
- Grouped by **category**: Navigation, Input, Messaging, Data Display, Utilities
- Items built from the registry; `routerLink` → `/components/:slug`
- "Help & Documentation" button pinned at the bottom

### Tabs (`DocsTabsComponent`)
- **Overview · Properties · Theming**
- Links relative to current component route

### Right TOC (`DocsRightTocComponent`)
- PrimeNG `PanelMenu`, 220px, "On this page"
- Items: Summary + each variation title + Usage + Component Activity
- `IntersectionObserver` highlights the active section on scroll; click scrolls to anchor
- **"Download Vignette"** button below the TOC (new element — action TBD)
- Shown on the Overview tab

---

## Tabs — content

### Overview (single scrolling page)

Rendered as one scrolling column, sections anchored for the TOC:

1. **Header card** — component name, description, tags for status / auth / contact (from front-matter)
2. **Variation sections** — for each variation: heading + anchor-link icon, description, a **live demo box**, and (where present) a **code block**
3. **Usage section** — subheader + two designed panels: green "When and how to use" and red "Do not use", each with bullet content
4. **Component Activity section** — "Activity/Measure" heading + details / image / visualization

### Properties
- The component's `@Input`/`@Output` table (formerly "API")
- **Auto-generated** from JSDoc + decorators via Compodoc JSON
- Columns: Name | Type | Default | Required | Description

### Theming
- Table of the **custom CSS variables** this component defines that a consumer can override
- Columns: Variable | Default | Description
- Source: **hand-authored** in front-matter (`theming[]`). Auto-parsing from the component `.css` is a future option.

> The Overview tab still contains a "Component Activity" section (per the design). There is no separate Activity *tab*.

---

## Content Generation — the core principle

**The source code / authored content is the single source of truth. Nothing is maintained twice.**

| Content | Source of truth | How it reaches the viewer |
|---------|-----------------|---------------------------|
| Properties table | JSDoc on the component's signal inputs / `@Output()`s in `libs/components` | `pnpm docs:properties` runs Compodoc → `documentation.json`; `tools/generate-docs-properties.mjs` extracts a typed `COMPONENT_PROPERTIES` map (committed); the Properties tab reads it by `compodocSymbol` |
| Variation code block | The `snippet:<id>` markers around the widget usage in the live demo template | `pnpm docs:snippets` (`tools/generate-docs-snippets.mjs`) extracts the marked markup into `COMPONENT_SNIPPETS`; the code block shows the exact markup that renders the demo — cannot drift |
| Overview prose + Usage text | Short structured front-matter (`description`, `usage.summary`, `usage.dos[]`, `usage.donts[]`, `activity.summary`) | Rendered directly into the structured header + do/don't panels. **No markdown** — the design has no long-form prose |
| Live demo | Real component usage inside `<ng-template>` in the showcase | Rendered directly |
| Theming variables | Hand-authored `theming[]` in front-matter | Rendered as a table (auto-parse from CSS is future) |
| Front-matter (name, category, status, tags, auth, contact, description) | `[component].docs.ts` in `libs/components` | Imported by the registry |
| Nav / routing / TOC | Central registry + section anchors | Built at runtime |

Patterns confirmed against Angular Material, Storybook + Compodoc, Taiga UI, ng-doc: hand-authored API tables and hand-copied code strings drift the moment the component changes — every mature lib engineered them away. **No ngx-highlightjs** — code blocks are plain styled `<pre><code>` matching the design's dark block, with a copy button.

> **`?raw` note:** the Angular esbuild builder (`@angular/build:application`) does not support `?raw` query imports. Instead of copying an example file, snippets are extracted from the *same* demo template via marker comments (`<!-- snippet:id -->…<!-- /snippet -->`), which keeps a single source of truth without a builder plugin. Regenerate both maps with `pnpm docs:generate`.

---

## Metadata / Registry

### Front-matter (`libs/components/src/lib/docs/docs.model.ts`)

Front-matter holds the structured copy plus keys that tie the component to its generated data. Properties come from Compodoc; snippets from the demo-template markers — those live in the generated maps, not here.

```typescript
export interface ComponentDoc {
  name: string;
  slug: string;
  category: 'Navigation' | 'Input' | 'Messaging' | 'Data Display' | 'Utilities';
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  description: string;          // header card text
  docsUrl?: string;
  compodocSymbol: string;       // class name Compodoc keys the Properties entry by
  variations: VariationDoc[];   // id ties each to its generated snippet; title/description are copy
  usage: UsageDoc;              // structured summary + do/don't bullets
  activity?: ActivityDoc;       // "Component Activity" copy
  properties?: ApiDoc;          // optional fallback; normally from COMPONENT_PROPERTIES
  theming: ThemingVar[];        // hand-authored overridable CSS variables
}

export interface VariationDoc {
  id: string;                   // anchor id for TOC + key into COMPONENT_SNIPPETS
  title: string;
  description: string;
  code?: string;                // optional fallback; normally from the generated snippet
  language: 'html' | 'typescript';
}

export interface ThemingVar {
  variable: string;             // e.g. --echo-progress-spinner-color (overridable by consumers)
  default: string;
  description: string;
}
```

### Co-location split
- **Properties** co-locate with the component in the strongest form — the component's own JSDoc on each signal input in `libs/components`; auto-extracted by Compodoc.
- **Front-matter** `[component].docs.ts` sits next to the component, exported via `libs/components/src/docs.ts`, **excluded from `index.ts`** so doc metadata never enters the published bundle.
- **Demo templates + snippet markers** live in `apps/demo` (presentation content, not the published contract).
- **Generated maps** (`COMPONENT_PROPERTIES`, `COMPONENT_SNIPPETS`) are committed under `apps/demo/.../docs-shell/generated/` so a clean checkout builds without running Compodoc.

### Path alias (`tsconfig.base.json`)
```json
"@jax-data-science/component-docs": ["libs/components/src/docs.ts"]
```

---

## File Layout

```
apps/demo/src/app/
├── docs-shell/
│   ├── docs-shell.component.ts / .html
│   ├── docs-left-nav/            (PanelMenu, grouped by category, from registry)
│   ├── docs-right-toc/           (PanelMenu "On this page" + Download Vignette; IntersectionObserver)
│   ├── docs-tabs/                (Overview · Properties · Theming)
│   ├── generated/               (COMMITTED generated maps — do not edit)
│   │   ├── component-properties.generated.ts   (COMPONENT_PROPERTIES, from Compodoc)
│   │   └── component-snippets.generated.ts      (COMPONENT_SNIPPETS, from demo markers)
│   └── tab-content/
│       ├── doc-overview/         (header card; id="summary")
│       ├── doc-variations/       (variation sections: demo + generated snippet)
│       ├── doc-usage/            (do/don't panels; id="usage")
│       ├── doc-activity/         (Component Activity; id="activity")
│       ├── doc-properties/       (reads COMPONENT_PROPERTIES → table)
│       └── doc-theming/          (CSS-variable override table from front-matter)
├── components/pages/[component]/
│   └── showcase-[component].component.ts/.html  (Overview composite; demo ng-templates w/ snippet markers)

libs/components/src/lib/[component]/
├── [component].component.ts      (per-input JSDoc = Properties source of truth)
├── [component].component.css     (CSS custom properties = Theming source)
└── [component].docs.ts           (front-matter)

libs/components/src/docs.ts       (front-matter barrel; excluded from index.ts)

tools/
├── generate-docs-properties.mjs  (Compodoc → COMPONENT_PROPERTIES)
└── generate-docs-snippets.mjs    (demo markers → COMPONENT_SNIPPETS)
```

The generated maps are committed so a clean checkout builds without Compodoc; regenerate with `pnpm docs:generate` when inputs/JSDoc or demo markup change.

---

## Routing

```
/                              → redirect to /components/progress-widget/overview
/components/:slug              → DocsShellComponent
    /overview                  → Showcase[Component]Component (the Overview composite; default)
    /properties                → DocPropertiesComponent
    /theming                   → DocThemingComponent
    (default)                  → redirect to overview
```

The `/overview` route loads the per-component showcase, which composes the generic `doc-overview` (header), `doc-variations`, `doc-usage`, and `doc-activity` into one scroll. `properties`/`theming` are generic. Legacy `components/docs/*` routes remain until each component is migrated.

---

## Styling — Tailwind (sanctioned direction)

Established in the IS-279 branch:
- Utility classes: `tw-` (Tailwind) + `echo-` (theme-bound) prefixes
- `libs/components/src/styles/components-tailwind.css`
- Generated `libs/themes/src/utilities.css` (~670 lines) via `libs/themes/scripts/generate-utilities.ts`
- Exposed via `@jax-data-science/themes/utilities.css` alias
- Setup in `docs/tailwind-setup.md`

All docs-system components use these utilities, not hardcoded values.

---

## New Component Convention

1. Write the component in `libs/components` with **JSDoc on each signal input / `@Output()`** → Properties table falls out automatically.
2. Declare overridable **CSS custom properties** in the component's `.css`, and list them in the front-matter `theming[]` → Theming table.
3. Add `[component].docs.ts` (front-matter: variations, usage, activity, theming, `compodocSymbol`) and export from `libs/components/src/docs.ts`.
4. In `apps/demo`, add `showcase-[component].component.ts` composing the Overview (`doc-overview` + `doc-variations` + `doc-usage` + `doc-activity`), with a demo `<ng-template>` per variation wrapping the widget usage in `<!-- snippet:<id> -->…<!-- /snippet -->` markers.
5. Add one entry to the docs registry (`ALL_DOCS`) and a route block (`overview`/`properties`/`theming`).
6. Run `pnpm docs:generate` to refresh the Properties + snippet maps, and commit them.
7. Left nav, TOC, tabs, Properties table, Theming table, code blocks update automatically. **No layout HTML edited.**

---

## Dependencies

| Package | Purpose | Status |
|---------|---------|--------|
| `@compodoc/compodoc` | Properties table from JSDoc | Added (dev) |
| Node generation scripts | Snippet extraction from demo markers (no `?raw` needed) | Added (`tools/`) |
| Tailwind toolchain | Styling (from IS-279) | Present |
| PrimeNG `PanelMenu` / `Table` / `Tag` / `Button` | Left nav + TOC, Properties/Theming tables, tags | Present |
| ~~`ngx-markdown`~~ | ~~Render markdown prose~~ | **Not used** — prose is structured front-matter |
| ~~`ngx-highlightjs` / `highlight.js`~~ | ~~Syntax highlighting~~ | **Removed** — plain styled `<pre>` |

---

## Reference Implementations

**IS-562** (`IS-562-implement-ux-ui-designed-component-section`) — now implements this design for the progress-widget pilot.
- **Stage 1 (done):** collapsed Variations + Usage into the **Overview** scroll; renamed API → **Properties**; added **Theming** tab; dropped per-variation/usage routes; removed ngx-highlightjs (plain `<pre>` + copy); regrouped left nav by category; reshaped `ComponentDoc`.
- **Stage 2 (done):** Properties generated from Compodoc (`COMPONENT_PROPERTIES`); code snippets extracted from demo-template markers (`COMPONENT_SNIPPETS`). Markdown intentionally **not** adopted — Overview/Usage are structured to match the design.
- **Remaining:** roll the pattern out to the other components (async-tasks, ontology-search, etc.) still on legacy routes.

**IS-279** (`IS-279-ontology-ac-impl`) — a separate ontology-search branch, **not** an implementation of this plan. Useful patterns to reuse: shared `doc-section` / `example-card` / `code-example` components, the Tailwind utility system (sanctioned), plain `<pre>` + clipboard copy. Its `HighlightPipe` is a search-term highlighter, unrelated to this docs system.

---

## Open Items

1. **Component Activity** — the Overview "Component Activity" section's purpose/content source is undefined. (No Activity tab.)
2. **Download Vignette** — button in the right TOC; action not yet defined.
3. **Theming auto-parse** — future: derive `theming[]` from the component's CSS custom properties instead of hand-authoring.

---

## Out of Scope

- Search across all component docs
- Versioning of docs
- External-facing public docs site
- Dark mode theming
