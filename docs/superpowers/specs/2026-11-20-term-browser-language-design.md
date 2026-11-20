# Term browser language support (HPO-218)

## Intent

Show translated term names in `lib-jds-term-browser` when a translation exists for the
language the consumer has chosen. hpo-web already does this on its term page (`main`
branch: `LanguageService`, `TranslatePipe`, normalisation in `OntologyService`); this
brings the term-content half of that into the toolkit in a reusable, service-free way.

## What exists

- The JAX ontology API already returns `translations` on `/terms/{id}`, `/children` and
  `/ancestors`: `{ language: 'TR', name, definition, status }`. Codes are uppercase;
  a missing name or definition is `''`.
- `JaxOntologyService` passes the JSON through unchanged, so the data already reaches the
  component — untyped.
- The component is deliberately free of services; `labels` translates its own UI text.

## Goals

- Rows render the translated name for the chosen language, falling back to `term.name`
  when there is no translation or its name is `''`.
- Switching language does not reset expansion, lazily resolved children or focus.
- Typeahead matches what is on screen.
- Screen readers get the right `lang` on translated names.

## Non-goals

- A language picker or language service in the toolkit.
- Listing available languages or mapping codes to display names (consumer's job).
- Re-sorting siblings by translated name.
- Translated definitions (the browser shows no definitions).
- Filtering on translation `status`.
- OLS translations.
- Wiring into hpo-web (follow-up, on the HPO-211 entity page).

## Anti-goals

- Changing language reloads or re-binds the tree.
- `language` conflated with `labels` (term content vs. component chrome).

## Approaches

| Approach | Trade-off | Picked |
|---|---|---|
| `language` input, consumer owns state | Component stays service-free; page also uses the language for title/definition | **Yes** |
| Built-in language selector | Puts page state inside the component; duplicates the page's own picker | No |
| Language state in the facade | A switch would go through `load()`, re-binding `tree` and resetting state linked to it | No |

Sibling order: keep the canonical (English) order so rows do not jump on a switch and
`buildTermTree` stays untouched. Language list and names: left to the consumer.

## Design

1. **`api-clients/.../ontology.model.ts`** — add
   `OntologyTermTranslation { language: string; name: string; definition?: string; status?: string }`
   and `translations?: OntologyTermTranslation[]` on `OntologyTerm`.
2. **`api-clients/.../ontology.service.jax.ts`** — lowercase `translation.language` in
   `term()` and `relation()` through one private normaliser.
3. **`term-browser.model.ts`** — add the same `translations?` to `JdsTerm`, keeping it
   structurally compatible with `OntologyTerm`; export a pure helper:
   ```ts
   export function termName(term: JdsTerm, language: string | null): string {
     const hit = language
       ? term.translations?.find(t => t.language.toLowerCase() === language.toLowerCase())
       : undefined;
     return hit?.name || term.name;
   }
   ```
   Case-insensitive so it also works with data not normalised by `JaxOntologyService`.
4. **`term-browser.component.ts` / `.html`** — `language = input<string | null>(null)`;
   template renders the resolved name and sets `[attr.lang]` only when a translation is
   shown; `onTypeahead` matches the resolved name; `asNodes` keeps sorting on `name`.
5. **Specs and `term-browser.docs.ts`** — fallback on missing/empty translation, code
   case, expansion surviving a language change, typeahead on translated names, `lang`
   attribute; docs describe `language` separately from `labels`.

## Left to the builder

- Exact name of the private normaliser and of the component method wrapping `termName`.
- Whether `termName` is re-exported from the components public API index (expected: yes,
  alongside the model types).
- Changelog entry wording, following the existing changelog convention.
