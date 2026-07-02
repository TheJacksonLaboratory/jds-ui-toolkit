# Component Documentation Page System — Design Spec

**Date:** 2026-06-29 (revised 2026-07-02 against actual Figma design)  
**Ticket:** IS-585 (design) / IS-562 (implementation story)  
**Design:** [Components-and-Documentation](https://www.figma.com/design/xIz1scHUqflk0N9SGbLOvK/Components-and-Documentation?node-id=2663-552)  
**Status:** Revised — original plan's tab structure did not match the design; corrected here

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
- **Content generated from source of truth, not hand-maintained** — Properties from JSDoc, code snippets from real example files, prose from markdown
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
| Properties table | JSDoc + `@Input()`/`@Output()` on the component in `libs/components` | Compodoc → `documentation.json`; viewer reads the per-component entry |
| Variation code block | The example component's own file in `apps/demo` | Imported as raw string (`import src from './x.component.ts?raw'`); same file is the live demo — cannot drift |
| Overview prose + Usage text | Markdown per component | `ngx-markdown` renders into the layout |
| Live demo | Real Angular example component | Rendered directly |
| Theming variables | Hand-authored `theming[]` in front-matter | Rendered as a table (auto-parse from CSS is future) |
| Front-matter (name, category, status, tags, auth, contact, description) | `[component].docs.ts` in `libs/components` | Imported by the registry |
| Nav / routing / TOC | Central registry + section anchors | Built at runtime |

Confirmed against Angular Material, Storybook + Compodoc, Taiga UI (`?raw`), ng-doc. Hand-authored API tables and hand-copied code strings drift the moment the component changes — every mature lib engineered them away. **No ngx-highlightjs** — code blocks are plain styled `<pre><code>` matching the design's dark block, with a copy button.

---

## Metadata / Registry

### Front-matter (`libs/components/src/lib/docs/docs.model.ts`)

Only what cannot be derived from source. Properties come from Compodoc; code from `?raw`; prose from markdown — none live here.

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
  compodocSymbol: string;       // class name Compodoc keys the Properties entry by
  variations: VariationMeta[];  // demo/code come from example files; this is just ordering + copy
  theming: ThemingVar[];        // hand-authored overridable CSS variables
  docsUrl?: string;
}

export interface VariationMeta {
  id: string;                   // anchor id for TOC
  title: string;
  description: string;
  exampleKey: string;          // maps to an example component + its ?raw source
}

export interface ThemingVar {
  variable: string;             // e.g. --jds-progress-widget-color (overridable by consumers)
  default: string;
  description: string;
}
```

Prose (`overview.md`, `usage.md`) is authored as markdown files in `apps/demo`, not in this interface.

### Co-location split
- **Properties** co-locate with the component in the strongest form — the component's own JSDoc/decorators in `libs/components`; auto-extracted.
- **Front-matter** `[component].docs.ts` sits next to the component, exported via `libs/components/src/docs.ts`, **excluded from `index.ts`** so doc metadata never enters the published bundle.
- **Prose markdown + example components** live in `apps/demo` (presentation content, not the published contract).

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
│   └── tab-content/
│       ├── doc-overview/         (renders header + variation sections + usage + activity section; markdown prose)
│       ├── doc-properties/       (reads Compodoc JSON → table)
│       └── doc-theming/          (CSS-variable override table from front-matter)
├── components/pages/[component]/
│   ├── showcase-[component].component.ts   (live demos; imports example sources via ?raw)
│   └── examples/                           (one real component file per variation → demo AND snippet)
└── docs/content/[component]/
    ├── overview.md
    └── usage.md

libs/components/src/lib/[component]/
├── [component].component.ts      (JSDoc + @Input/@Output = Properties source of truth)
├── [component].component.css     (CSS custom properties = Theming source)
└── [component].docs.ts           (front-matter)

libs/components/src/docs.ts       (front-matter barrel; excluded from index.ts)
```

Compodoc `documentation.json` is generated at build/CI and served as an app asset; not committed as authored content.

---

## Routing

```
/                              → redirect to /components/progress-widget
/components/:slug              → DocsShellComponent
    /overview                  → DocOverviewComponent (default)
    /properties                → DocPropertiesComponent
    /theming                   → DocThemingComponent
    (default)                  → redirect to overview
```

Routes built from `COMPONENT_DOC_REGISTRY` (slug → front-matter + showcase component). One entry per component keeps `app.routes.ts` DRY.

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

1. Write the component in `libs/components` with **JSDoc on the class and every `@Input()`/`@Output()`** → Properties table falls out automatically.
2. Declare overridable **CSS custom properties** in the component's `.css`, and list them in the front-matter `theming[]` → Theming table.
3. Add `[component].docs.ts` (front-matter + variation list + theming) and export from `libs/components/src/docs.ts`.
4. In `apps/demo`, add one example component per variation under `pages/[component]/examples/`, plus `showcase-[component].component.ts` importing each via `?raw`.
5. Add `overview.md` and `usage.md` under `apps/demo/src/app/docs/content/[component]/`.
6. Add one entry to `COMPONENT_DOC_REGISTRY`.
7. Left nav, routes, tabs, TOC, Properties table, Theming table update automatically. **No layout HTML edited.**

---

## Dependencies

| Package | Purpose | Status |
|---------|---------|--------|
| `@compodoc/compodoc` | Properties table from JSDoc/decorators | Add (dev) |
| `ngx-markdown` | Render overview/usage markdown | Add |
| `?raw` import support | Example source as snippet | Verify Nx/esbuild; add raw-loader if needed |
| Tailwind toolchain | Styling (from IS-279) | Present |
| PrimeNG `PanelMenu` / `Table` / `Tag` | Left nav + TOC, Properties/Theming tables, tags | Present |
| ~~`ngx-highlightjs` / `highlight.js`~~ | ~~Syntax highlighting~~ | **Not used** — plain styled `<pre>` |

---

## Reference Implementations

**IS-562** (`IS-562-implement-ux-ui-designed-component-section`, local) — built the shell against the *original* plan: `DocsShellComponent`, left nav (PanelMenu), right TOC, `COMPONENT_SHOWCASE_MAP`, ComponentDoc barrel + alias, generic tab components, ngx-highlightjs, progress-widget pilot.
- **Keep:** shell/left-nav/right-TOC scaffolding, registry, barrel, alias, ComponentDoc co-location.
- **Rework to match design:** collapse Variations + Usage into **Overview** sections (one scroll); rename API → **Properties** (switch to Compodoc); add **Theming** tab; drop the per-variation/usage routes; remove ngx-highlightjs; move code snippets to `?raw`; add markdown prose; regroup left nav by category.

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
