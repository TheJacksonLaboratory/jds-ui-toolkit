# Contributing a Service to the Docs System

This guide covers adding a new API client service (from `libs/api-clients`) to
the documentation site (`apps/demo`). Like the component docs system, this is
**generation-driven** for the parts that can drift from source: the Methods
table comes from your service's JSDoc (Compodoc), so you never maintain it by
hand. See [`docs/contributing-a-component.md`](./contributing-a-component.md)
for the component equivalent — the two systems share the same shell chrome
(left nav, tabs, right TOC) and the same underlying `DocBase` shape, but are
otherwise independent: a Methods tab instead of Properties, no Theming tab,
and no live-demo variations (services have no UI to render, so usage examples
are static code blocks).

Use the shipped **`ontology`** service as a reference implementation while you
read. See [`docs/superpowers/specs/2026-07-07-services-docs-design.md`](./superpowers/specs/2026-07-07-services-docs-design.md)
for the design rationale.

---

## How a service page is assembled

A service page has two tabs:

| Tab | Content | Source of truth |
|-----|---------|-----------------|
| **Overview** | Header card, static usage-example code blocks, Usage do/don't panels, Activity | Front-matter (hand-authored) |
| **Methods** | Method name / signature / return type / description table | **Generated** from the service's JSDoc (Compodoc) |

There is no Theming tab — services don't expose CSS custom properties, and
`ServiceDoc` has no `theming` field at all.

Left nav, tabs, and routing are all derived from a registry — you never edit
layout HTML. Unlike Components, the Services left-nav section currently lists
services as a flat list (no category grouping) — see Step 5.

One committed, generated file backs the Methods tab:

- `apps/demo/src/app/docs-shell/generated/service-methods.generated.ts`

Regenerate it with `pnpm docs:methods` (details in step 5).

---

## Checklist

1. Author the service with per-method JSDoc
2. Write the front-matter (`[service].docs.ts`) and export it
3. Build the showcase (Overview) with static usage-example code blocks
4. Register the service (services registry + route)
5. Generate the Methods map
6. Verify

---

## 1. Author the service with per-method JSDoc

In `libs/api-clients/src/lib/services/<service>/`, put a JSDoc comment on
**each** public method. Compodoc reads per-method JSDoc, so the Methods table
is only as good as these comments.

```ts
export class MyServiceClient {
  /**
   * Fetches a widget by its ID.
   * @param id - the widget ID
   */
  getWidget(id: string): Observable<Widget> {
    return this.httpClient.get<Widget>(`/widgets/${id}`);
  }
}
```

If your service is an abstract contract with multiple concrete
implementations (like `OntologyService` → `JaxOntologyService` /
`OLSOntologyService`), put the JSDoc on the **abstract class's** method
declarations, not on each implementation. That way there's one documented
contract, not near-duplicate tables per implementation:

```ts
export abstract class MyServiceContract {
  /**
   * Fetches a widget by its ID.
   * @param id - the widget ID
   */
  abstract getWidget(id: string): Observable<Widget>;
}
```

Compodoc categorizes plain classes (no `@Injectable()`) under a different
JSON key than `@Injectable` services — the generator in step 5 already
handles both, so this doesn't require any extra configuration on your part.

## 2. Front-matter — `[service].docs.ts`

Create `libs/api-clients/src/lib/services/<service>/<service>.docs.ts`
implementing `ServiceDoc`, and export it from the services docs barrel.

```ts
import { ServiceDoc } from '../../docs/service-docs.model';

export const myServiceDoc: ServiceDoc = {
  name: 'My Service',
  slug: 'my-service',                // used in the URL and as a lookup key
  category: 'Data Access',           // Ontology | Data Access | Async Processing | Genomics
  status: 'in-progress',             // stable | in-progress | deprecated
  tags: ['example'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'MyServiceClient', // the class name — keys the generated Methods entry
  description: 'One-paragraph summary shown on the header card.',
  docsUrl: 'https://jax.org/docs/services/my-service', // optional

  // Hand-authored — there's no live UI to scrape a snippet from, unlike
  // component variations. One example per way of using the service (e.g.
  // one per implementation, if there's more than one).
  usageExamples: [
    {
      id: 'basic',
      title: 'Basic Usage',
      description: 'Inject the service and call a method.',
      code: `import { inject } from '@angular/core';
import { MyServiceClient } from '@jax-data-science/api-clients';

export class MyComponent {
  private myService = inject(MyServiceClient);

  loadWidget(id: string) {
    return this.myService.getWidget(id);
  }
}`,
      language: 'typescript',
    },
  ],

  usage: {
    summary: 'When to reach for this service.',
    dos: ['Do this.'],
    donts: ['Not this.'],
  },

  activity: { summary: 'Adoption notes.' }, // optional

  // `methods` is intentionally omitted — it comes from the generated map.
};
```

Add it to the services barrel (`libs/api-clients/src/docs.ts`):

```ts
export * from './lib/services/my-service/my-service.docs';
```

> **Do not import from `@jax-data-science/component-docs` in
> `libs/api-clients`.** `libs/components` already depends on
> `libs/api-clients` (e.g. `AsyncTaskService`), so an import in the other
> direction creates a circular project dependency. `ServiceDoc` declares its
> shared fields (`name`, `status`, `usage`, `activity`, etc.) independently in
> `service-docs.model.ts` instead of extending a `DocBase` imported from
> components — structural typing keeps it assignable anywhere a `DocBase` is
> expected (e.g. `DocsContextService`) without the import. Follow the same
> pattern for any new shared type; don't reach for the components barrel.

> Like the components barrel, `libs/api-clients/src/docs.ts` is **not**
> exported from `index.ts` — docs metadata never ships in the published
> `api-clients` bundle.

## 3. Showcase (Overview) — static usage examples

In `apps/demo/src/app/services/pages/<service>/`, create
`showcase-<service>.component.ts` + `.html`. Unlike components, there's no
live demo template — just render each usage example's `code` as a static
block, using the generic `DocOverview`/`DocUsage`/`DocActivity` tab-content
components for everything else.

`showcase-<service>.component.ts`:

```ts
import { Component } from '@angular/core';
import { myServiceDoc } from '@jax-data-science/service-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-my-service',
  imports: [DocOverviewComponent, DocUsageComponent, DocActivityComponent],
  templateUrl: './showcase-my-service.component.html',
  styleUrl: './showcase-my-service.component.css',
  standalone: true,
})
export class ShowcaseMyServiceComponent {
  readonly doc = myServiceDoc;
}
```

`showcase-<service>.component.html` — one `<section>` per usage example,
matching its `id` to the anchor the right-side TOC links to:

```html
<div class="tw-p-8 tw-max-w-4xl">
  <app-doc-overview></app-doc-overview>

  <section id="basic" class="tw-mt-12">
    <h2 class="tw-text-2xl tw-font-semibold tw-mb-2">{{ doc.usageExamples[0].title }}</h2>
    <p class="tw-text-gray-700 tw-mb-4">{{ doc.usageExamples[0].description }}</p>
    <pre class="tw-bg-gray-100 tw-p-4 tw-rounded tw-text-sm tw-overflow-auto"><code>{{ doc.usageExamples[0].code }}</code></pre>
  </section>

  <app-doc-usage></app-doc-usage>
  <app-doc-activity></app-doc-activity>
</div>
```

**Key rule:** if you're tempted to make a usage example call the service live
(inject it and subscribe in the showcase component), only do that if the
service is safe to call with no auth, no side effects, and a real backend
that's actually reachable — verify the URL resolves *before* wiring it up.
Prefer static code blocks by default; that's why `usageExamples[].code` is a
plain hand-authored string rather than something scraped from a live
template.

Also add a spec (same `should create` pattern as every other showcase page —
see any existing `showcase-*.component.spec.ts` for the shape).

## 4. Register the service

Add the doc to `ALL_SERVICE_DOCS` in
`apps/demo/src/app/services-shell/services-shell.component.ts`:

```ts
export const ALL_SERVICE_DOCS: ServiceDoc[] = [ontologyDoc, myServiceDoc];
```

Add a route block in `apps/demo/src/app/app.routes.ts` under the `services`
shell:

```ts
{
  path: 'my-service',
  children: [
    { path: 'overview', component: ShowcaseMyServiceComponent },
    { path: 'methods', component: DocMethodsComponent },
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ],
},
```

The left nav picks up the new service automatically from
`ALL_SERVICE_DOCS` — no layout edits. It currently renders services as a
flat list (no category grouping, unlike Components); if/when that changes,
it'll be a change to `DocsLeftNavComponent` alone, not to individual
service front-matter.

## 5. Generate the Methods map

```bash
pnpm docs:methods
# or as part of the full set:
pnpm docs:generate      # properties + methods + snippets
```

Commit the regenerated file at
`apps/demo/src/app/docs-shell/generated/service-methods.generated.ts`. It's
committed so a clean checkout builds without running Compodoc. **Rerun
`pnpm docs:methods` whenever you change a service's public methods or their
JSDoc.**

## 6. Verify

```bash
npx nx build api-clients
npx nx build demo
npx nx lint api-clients
npx nx lint demo
npx nx test api-clients
npx nx test demo
```

Then serve and click through the new page:

```bash
pnpm start
# open /services/my-service/overview
```

Check: header/tags render, each usage example shows its code block, Usage
panels populate, Methods table shows your methods with descriptions, and the
service appears in the left nav under Services.

---

## Gotchas

- **Empty Methods descriptions** → JSDoc is missing on the method (or, for a
  multi-implementation service, on the *abstract* declaration rather than a
  concrete override). Add it and rerun `pnpm docs:methods`.
- **`compodocSymbol` typo** → Methods tab falls back to empty (or the
  front-matter `methods` fallback if present). It must equal the exported
  class name — abstract or concrete, whichever you documented in step 1.
- **Circular dependency build error** (`Could not execute command because
  the task graph has a circular dependency`) → you imported
  `@jax-data-science/component-docs` from somewhere in `libs/api-clients`.
  Declare the shared fields locally instead (see the note in step 2).
- **Service missing from the left nav** → not added to `ALL_SERVICE_DOCS`.
- **Synchronous throw when injecting a service in a showcase** → some
  service methods build their request eagerly (e.g. resolving a config
  loaded asynchronously in the constructor) and throw before you even
  subscribe if called too early. This is exactly why usage examples are
  static code by default rather than live calls — if you do wire up a live
  call anyway, wrap it in `defer(() => service.method(...))` so a failure
  becomes an observable error instead of an exception during component
  construction, and `catchError` it into a visible error state rather than
  letting it crash the page.
- **No syntax highlighting** — intentional, same rule as components. Code
  blocks are plain styled `<pre>`; do not add `ngx-highlightjs`.
- **No live demo variations** — intentional. Services have no UI to render,
  so there's no equivalent of a component's `snippet:<id>` marker/live
  template pattern. Don't try to force one.
