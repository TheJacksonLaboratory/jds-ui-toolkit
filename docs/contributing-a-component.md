# Contributing a Component to the Docs System

This guide covers everything needed to add a new component to the documentation
site (`apps/demo`). The docs system is **generation-driven**: the Properties
table and code snippets come from your component's source, so you never maintain
them by hand. See the design in
[`docs/superpowers/specs/2026-06-29-component-page-design.md`](./superpowers/specs/2026-06-29-component-page-design.md).

Use the shipped **`progress-widget`** as a reference implementation while you
read.

---

## How a component page is assembled

A component page has three tabs:

| Tab | Content | Source of truth |
|-----|---------|-----------------|
| **Overview** | Header card, variation sections (live demo + code), Usage do/don't panels, Component Activity | Front-matter + demo templates |
| **Properties** | `@Input` / signal-input / `@Output` table | **Generated** from the component's JSDoc (Compodoc) |
| **Theming** | Overridable CSS variables | Hand-authored front-matter |

Left nav, right "On this page" TOC, tabs, and routing are all derived from the
registry — you never edit layout HTML.

Two committed, generated files back the anti-drift tabs:

- `apps/demo/src/app/docs-shell/generated/component-properties.generated.ts`
- `apps/demo/src/app/docs-shell/generated/component-snippets.generated.ts`

Regenerate them with `pnpm docs:generate` (details in step 6).

---

## Checklist

1. Author the component with per-input JSDoc
2. Declare overridable CSS variables
3. Write the front-matter (`[component].docs.ts`) and export it
4. Build the showcase (Overview) with demo templates + snippet markers
5. Register the component (docs list + route)
6. Generate the Properties + snippet maps
7. Verify

---

## 1. Author the component with per-input JSDoc

In `libs/components/src/lib/<component>/`, put a JSDoc comment on **each** input.
Compodoc reads per-property JSDoc (a single class-level block will **not** map
to individual rows), so the Properties table is only as good as these comments.

```ts
export class MyWidgetComponent {
  /** Controls whether the widget is visible. */
  isOpen = input(false);
  /** Text shown in the header. */
  title = input('');
}
```

Both signal inputs (`input()`) and `@Input()` decorators are supported. Give
`@Output()`s / `output()`s a JSDoc line too — they populate the Outputs table.

## 2. Declare overridable CSS variables

Expose any consumer-overridable values as CSS custom properties in the
component's `.css`. You'll list them in the front-matter for the Theming tab
(auto-parsing from CSS is a future improvement).

## 3. Front-matter — `[component].docs.ts`

Create `libs/components/src/lib/<component>/<component>.docs.ts` implementing
`ComponentDoc`, and export it from the docs barrel.

```ts
import { ComponentDoc } from '../docs/docs.model';

export const myWidgetDoc: ComponentDoc = {
  name: 'My Widget',
  slug: 'my-widget',                 // used in the URL and as a lookup key
  category: 'Utilities',             // Navigation | Input | Messaging | Data Display | Utilities
  status: 'in-progress',             // stable | in-progress | deprecated
  tags: ['example'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'MyWidgetComponent', // the class name — keys the generated Properties entry
  description: 'One-paragraph summary shown on the header card.',
  docsUrl: 'https://jax.org/docs/components/my-widget', // optional

  // Each variation's `id` is the TOC anchor AND the key into the generated snippet.
  // No `code` needed — it is generated from the demo template (step 4).
  variations: [
    { id: 'basic', title: 'Basic', description: 'Default usage.', language: 'html' },
  ],

  usage: {
    summary: 'When to reach for this component.',
    dos: ['Do this.', 'And this.'],
    donts: ['Not this.'],
  },

  activity: { summary: 'Adoption / measure notes.' }, // optional

  theming: [
    { variable: '--echo-my-widget-color', default: 'var(--echo-primary-color)', description: 'Accent color.' },
  ],

  // `properties` is intentionally omitted — it comes from the generated map.
};
```

Add it to the barrel (`libs/components/src/docs.ts`):

```ts
export * from './lib/my-widget/my-widget.docs';
```

> The barrel is intentionally **excluded from `index.ts`** so docs metadata
> never ships in the published library bundle.

## 4. Showcase (Overview) — demo templates + snippet markers

In `apps/demo/src/app/components/pages/<component>/`, create
`showcase-<component>.component.ts` + `.html`. The showcase composes the
generic Overview pieces and supplies the live demos.

`showcase-<component>.component.html`:

```html
<div class="tw-p-8 tw-max-w-4xl">
  <app-doc-overview></app-doc-overview>
  <app-doc-variations [doc]="doc" [demoTemplates]="demoTemplates"></app-doc-variations>
  <app-doc-usage></app-doc-usage>
  <app-doc-activity></app-doc-activity>
</div>

<!-- One template per variation. Wrap the copy-worthy usage in snippet markers. -->
<ng-template #tplBasic>
  <!-- snippet:basic -->
  <lib-my-widget [title]="'Hello'"></lib-my-widget>
  <!-- /snippet -->
</ng-template>
```

`showcase-<component>.component.ts` — import the four generic components and the
widget, expose the `doc`, and map each `<ng-template>` to its variation `id`:

```ts
@ViewChild('tplBasic') tplBasic!: TemplateRef<void>;

readonly doc = myWidgetDoc;
demoTemplates = new Map<string, TemplateRef<void>>();

ngAfterViewInit(): void {
  this.demoTemplates = new Map([['basic', this.tplBasic]]);
  this.cdr.detectChanges();
}
```

**Key rule:** the markup between `<!-- snippet:<id> -->` and `<!-- /snippet -->`
is what shows in the code block. It's pulled from the *same* template that
renders the demo, so the snippet can never drift. For interactive demos, put the
markers around just the widget usage (not the surrounding harness).

## 5. Register the component

Add the doc to the registry list in
`apps/demo/src/app/docs-shell/docs-shell.component.ts`:

```ts
const ALL_DOCS: ComponentDoc[] = [
  progressWidgetDoc,
  myWidgetDoc,   // ← add
];
```

Add a route block in `apps/demo/src/app/app.routes.ts` under the `components`
shell:

```ts
{
  path: 'my-widget',
  children: [
    { path: 'overview', component: ShowcaseMyWidgetComponent },
    { path: 'properties', component: DocPropertiesComponent },
    { path: 'theming', component: DocThemingComponent },
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ],
},
```

The left nav and TOC update automatically from the registry — no layout edits.

## 6. Generate the Properties + snippet maps

```bash
pnpm docs:generate      # runs both generators
# or individually:
pnpm docs:properties    # Compodoc → COMPONENT_PROPERTIES
pnpm docs:snippets      # demo markers → COMPONENT_SNIPPETS
```

Commit the regenerated files under
`apps/demo/src/app/docs-shell/generated/`. They are committed so a clean
checkout builds without running Compodoc. **Rerun `pnpm docs:generate` whenever
you change a component's inputs/outputs, their JSDoc, or the demo markup.**

## 7. Verify

```bash
npx nx build demo
npx nx lint demo
npx nx test demo
```

Then serve and click through the new page:

```bash
pnpm start   # nx serve demo
# open /components/my-widget/overview
```

Check: header/tags render, each variation shows a live demo and matching code,
Usage panels populate, Properties table shows your inputs with descriptions,
Theming lists your CSS variables, and the component appears in the left nav
under its category.

---

## Gotchas

- **Empty Properties descriptions** → JSDoc is on the class block, not each
  input. Move it onto each property and rerun `pnpm docs:properties`.
- **Code block shows nothing / wrong markup** → missing or mismatched
  `snippet:<id>` markers, or the `id` doesn't match the variation `id`. Rerun
  `pnpm docs:snippets`.
- **`compodocSymbol` typo** → Properties tab falls back to empty (or the
  front-matter `properties` fallback if present). It must equal the exported
  class name.
- **Component missing from the left nav** → not added to `ALL_DOCS`, or an
  unknown `category`.
- **No syntax highlighting** — intentional. Code blocks are plain styled
  `<pre>`; do not add `ngx-highlightjs`.
- **No markdown** — Overview/Usage prose is structured front-matter by design;
  do not introduce `ngx-markdown`.
