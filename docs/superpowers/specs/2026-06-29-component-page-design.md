# Component Documentation Page System — Design Spec

**Date:** 2026-06-29  
**Ticket:** IS-585  
**Status:** Approved, ready for implementation planning

---

## Problem

The demo app (`apps/demo`) has a component showcase system that is not scalable. The current `ComponentDocsComponent` acts as a god object — all metadata is hardcoded in one file, navigation lives in the top navbar, and there is no consistent structure for displaying variations, usage guidance, or API documentation. Adding a new component requires knowing to update multiple disconnected files.

---

## Goals

- Flexible, extensible docs system for all components in `libs/components`
- Component developers co-locate documentation with their code
- Consistent page structure across all components
- Live demos + syntax-highlighted code snippets with copy button
- 3-column layout matching Figma design (left nav | content | right TOC)

---

## Decisions

| Question | Decision |
|----------|----------|
| Tab structure | Fixed: Overview, Variations, Usage, API |
| Code snippets | Syntax-highlighted via `ngx-highlightjs`, copy button |
| Top navbar | Stripped to branding + auth only; left nav handles component navigation |
| API documentation | Manual `ApiProp[]` tables defined in `.docs.ts` files |
| Metadata location | Co-located in `libs/components` as `[component].docs.ts` |

---

## Architecture

### Routing

```
/                                    → redirect to /components/progress-widget/overview
/components                          → DocsShellComponent
  /progress-widget
    /overview                        → DocOverviewComponent (generic)
    /variations                      → ShowcaseProgressWidgetComponent (per-component)
    /usage                           → DocUsageComponent (generic)
    /api                             → DocApiComponent (generic)
    (default)                        → redirect to overview
  /async-tasks
    /overview                        → DocOverviewComponent
    /variations                      → ShowcaseAsyncTasksComponent
    /usage                           → DocUsageComponent
    /api                             → DocApiComponent
  ... (one block per component)
/services                            → DocsShellComponent (same shell)
  /isa-data
    /overview → /variations → /usage → /api
```

Routes are built from a registry (`COMPONENT_SHOWCASE_MAP`) that maps slug → showcase component type. This keeps `app.routes.ts` DRY while allowing per-component showcase components to act as the `/variations` route:

```typescript
// component-showcase-map.ts
export const COMPONENT_SHOWCASE_MAP: Record<string, Type<unknown>> = {
  'progress-widget': ShowcaseProgressWidgetComponent,
  'async-tasks': ShowcaseAsyncTasksComponent,
  // one entry per component
};
```

`DocsShellComponent` reads the active child route's first URL segment to determine the current slug, looks up `ComponentDoc` from the docs registry, and distributes it to left nav, right TOC, and tab bar.

Overview, Usage, and API tabs are fully generic — same `DocOverviewComponent`, `DocUsageComponent`, `DocApiComponent` reused across all components, receiving `ComponentDoc` via a shared service or route data. The `/variations` tab loads the component-specific showcase, which internally uses the shared `DocVariationsComponent`.

### File Layout

```
apps/demo/src/app/
├── docs-shell/
│   ├── docs-shell.component.ts
│   ├── docs-shell.component.html
│   ├── docs-left-nav/
│   │   ├── docs-left-nav.component.ts
│   │   └── docs-left-nav.component.html
│   ├── docs-right-toc/
│   │   ├── docs-right-toc.component.ts
│   │   └── docs-right-toc.component.html
│   ├── docs-tabs/
│   │   ├── docs-tabs.component.ts
│   │   └── docs-tabs.component.html
│   └── tab-content/                             (shared, generic tab components)
│       ├── doc-overview/
│       │   ├── doc-overview.component.ts
│       │   └── doc-overview.component.html
│       ├── doc-variations/
│       │   ├── doc-variations.component.ts      ← generic, accepts TemplateRef map
│       │   └── doc-variations.component.html
│       ├── doc-usage/
│       │   ├── doc-usage.component.ts
│       │   └── doc-usage.component.html
│       └── doc-api/
│           ├── doc-api.component.ts
│           └── doc-api.component.html
├── components/pages/
│   └── [component]/
│       └── showcase-[component].component.ts    (existing — keep, wraps doc-variations)

libs/components/src/
├── lib/
│   └── [component]/
│       ├── [component].component.ts             (existing)
│       └── [component].docs.ts                  (NEW)
├── lib/docs/
│   └── docs.model.ts                            (NEW — shared interfaces)
└── docs.ts                                      (NEW — docs barrel, not in index.ts)
```

---

## Metadata System

### Interfaces (`libs/components/src/lib/docs/docs.model.ts`)

```typescript
export interface ComponentDoc {
  name: string;
  slug: string;
  description: string;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  group: 'components' | 'services';
  overview: {
    summary: string;
    docsUrl?: string;
  };
  variations: VariationDoc[];
  usage: UsageDoc;
  api: ApiDoc;
}

export interface VariationDoc {
  id: string;
  title: string;
  description: string;
  code: string;
  language: 'html' | 'typescript';
}

export interface UsageDoc {
  summary: string;
  dos: string[];
  donts: string[];
}

export interface ApiDoc {
  inputs: ApiProp[];
  outputs: ApiProp[];
}

export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}
```

### Co-location Convention

Each component in `libs/components` gets a `[component].docs.ts` file alongside its component file:

```
libs/components/src/lib/progress-widget/
├── progress-widget.component.ts
├── progress-widget.component.html
├── progress-widget.component.css
└── progress-widget.docs.ts              ← NEW
```

### Docs Barrel

`libs/components/src/docs.ts` exports all docs — explicitly excluded from `index.ts` so docs metadata never enters the published library bundle:

```typescript
export * from './lib/docs/docs.model';
export * from './lib/progress-widget/progress-widget.docs';
export * from './lib/asynctask/asynctask.docs';
// one line per component
```

### Nx Path Alias

Added to `tsconfig.base.json`:

```json
"@jax-data-science/component-docs": ["libs/components/src/docs.ts"]
```

`DocsShellComponent` imports all `ComponentDoc` objects, builds a `Map<string, ComponentDoc>` keyed by `slug`, and resolves the active doc from the `:name` route param.

---

## Navigation

### Left Nav (`DocsLeftNavComponent`)

- Uses PrimeNG `PanelMenu` (already in project)
- 240px fixed width, sticky, full height below top navbar
- Menu items built dynamically from all `ComponentDoc` entries
- Grouped by `ComponentDoc.group` ('components' | 'services')
- `routerLink` points to `/components/:slug/overview` or `/services/:slug/overview`
- Active item highlighted via Angular router's `routerLinkActive`

### Tab Bar (`DocsTabsComponent`)

- Uses PrimeNG `TabMenu` (referenced in Figma annotations)
- Resized to 1.25rem (20px) per Figma spec; bold when selected
- Four fixed tabs: Overview | Variations | Usage | API
- Links to `./overview`, `./variations`, `./usage`, `./api` relative to current route

### Right TOC (`DocsRightTocComponent`)

- 220px fixed width
- Items generated from active `ComponentDoc.variations[].title` + fixed anchors for "Usage" and "API" sections
- `IntersectionObserver` tracks section headings, highlights current section on scroll
- Clicking an item scrolls to the corresponding anchor
- Visible only on Variations and Usage tabs; hidden on Overview and API

---

## Tab Content

### Overview Tab (`DocOverviewComponent`)

Fully data-driven from `ComponentDoc`. No per-component HTML needed.

- Header: component name (2.5rem / 40px per Figma), status PrimeNG Tag
- Tags row: topic tags using PrimeNG Tag
- Summary: `overview.summary` text
- Sidebar info: auth requirement, contact, external docs link

### Variations Tab (`DocVariationsComponent`)

Iterates `ComponentDoc.variations[]`. Per variation, renders a card:

1. **Title** (1.5rem / 24px per Figma) + anchor link icon (links back to this variation)
2. **Description** text
3. **Live demo area** — renders `TemplateRef` passed from the showcase component via `@Input() demoTemplates: Map<string, TemplateRef<void>>` keyed by `variation.id`
4. **Code block** — `ngx-highlightjs` renders `variation.code`, language set from `variation.language`. Copy button uses `navigator.clipboard.writeText()`

Each section heading gets an `id` attribute matching `variation.id` for TOC anchor navigation.

The showcase component (`showcase-[component].component.ts`) is the parent. It:
- Imports `DocVariationsComponent`
- Declares `<ng-template>` elements for each variation's live demo
- Passes them as a `Map` to `DocVariationsComponent`

### Usage Tab (`DocUsageComponent`)

Data-driven from `ComponentDoc.usage`. No per-component HTML.

- Summary paragraph
- Two-column grid: Do's (✓) and Don'ts (✗) from `UsageDoc.dos[]` / `UsageDoc.donts[]`

### API Tab (`DocApiComponent`)

Data-driven from `ComponentDoc.api`. No per-component HTML.

- Two PrimeNG `Table` instances: Inputs and Outputs
- Columns: Name | Type | Default | Required | Description
- Sortable columns; no pagination (small row count)

---

## New Component Convention

When adding a new component to `libs/components`:

1. Create `[component].docs.ts` implementing `ComponentDoc` in the component folder
2. Add export to `libs/components/src/docs.ts`
3. Add showcase component + tab content in `apps/demo/src/app/components/pages/[component]/`
4. Add route entry to `apps/demo/src/app/app.routes.ts`
5. Left nav updates automatically (driven from the docs registry)

---

## Dependencies

| Package | Purpose | Already installed? |
|---------|---------|-------------------|
| `ngx-highlightjs` | Syntax highlighting | No — add |
| `highlight.js` | Peer dep of ngx-highlightjs | No — add |
| PrimeNG `PanelMenu` | Left nav | Yes |
| PrimeNG `TabMenu` | Tab bar | Yes |
| PrimeNG `Table` | API tab | Yes |
| PrimeNG `Tag` | Status + topic tags | Yes |

---

## Out of Scope

- Compodoc or auto-generated API docs
- Search across all component docs
- Versioning of docs
- External-facing public docs site
- Dark mode theming
