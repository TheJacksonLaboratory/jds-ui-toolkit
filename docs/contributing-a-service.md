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

Every service shares one generic `ServiceOverviewComponent` for its Overview
tab — there's no per-service component to write. Adding a service is
front-matter + registration + a route, nothing else.

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

Regenerate it with `pnpm docs:methods` (details in step 4).

---

## Checklist

1. Author the service with per-method JSDoc
2. Write the front-matter (`[service].docs.ts`) and export it
3. Register the service (services registry + route)
4. Generate the Methods map
5. Verify

There's no "build a showcase" step — every service's Overview tab is rendered
by the same shared `ServiceOverviewComponent`, driven entirely by your
front-matter's `usageExamples`. Adding a service means writing data, not a
new component.

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
JSON key than `@Injectable` services — the generator in step 4 already
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

## 3. Register the service

There's no showcase file to write. Every service's Overview tab is rendered
by `apps/demo/src/app/services-shell/service-overview/service-overview.component.ts`
— a single component that reads whatever `ServiceDoc` is currently in
context (via `DocsContextService`, set by `ServicesShellComponent` off the
URL slug) and loops over its `usageExamples`, rendering each one as a
`<section>` with a header, description, and static code block, followed by
the generic `DocOverview`/`DocUsage`/`DocActivity` tab-content pieces. All of
that content comes from your front-matter — there is nothing to build here.

**Key rule:** usage examples are hand-authored, static code — not live
calls. If you're tempted to make one inject the service and call it for
real, only do that if the service is safe to call with no auth, no side
effects, and a real backend that's actually reachable (verify the URL
resolves *before* wiring it up), and even then, prefer adding that logic in
a one-off page rather than the shared `ServiceOverviewComponent`. Static
code blocks are the default for a reason: they can't drift, break, or throw.

Add the doc to `ALL_SERVICE_DOCS` in
`apps/demo/src/app/services-shell/services-shell.component.ts`:

```ts
export const ALL_SERVICE_DOCS: ServiceDoc[] = [ontologyDoc, myServiceDoc];
```

Add a route block in `apps/demo/src/app/app.routes.ts` under the `services`
shell, reusing the same `ServiceOverviewComponent` every other service uses:

```ts
{
  path: 'my-service',
  children: [
    { path: 'overview', component: ServiceOverviewComponent },
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

## 4. Generate the Methods map

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

## 5. Verify

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
- **Private/protected methods leaking into the Methods table** → the
  generator filters out TypeScript's `private`/`protected` modifiers, but
  only for methods it recognizes as such via Compodoc's `modifierKind`. If a
  method shows up that shouldn't, check it's actually declared `private`/
  `protected` (not just conventionally named) and rerun `pnpm docs:methods`.
- **Synchronous throw when injecting a service somewhere live** → some
  service methods build their request eagerly (e.g. resolving a config
  loaded asynchronously in the constructor) and throw before you even
  subscribe if called too early. This is exactly why usage examples are
  static code by default rather than live calls — if you ever do wire up a
  live call (outside `ServiceOverviewComponent`, in a one-off page), wrap it
  in `defer(() => service.method(...))` so a failure becomes an observable
  error instead of an exception during component construction, and
  `catchError` it into a visible error state rather than letting it crash
  the page.
- **No syntax highlighting** — intentional, same rule as components. Code
  blocks are plain styled `<pre>`; do not add `ngx-highlightjs`.
- **No live demo variations** — intentional. Services have no UI to render,
  so there's no equivalent of a component's `snippet:<id>` marker/live
  template pattern. Don't try to force one.
