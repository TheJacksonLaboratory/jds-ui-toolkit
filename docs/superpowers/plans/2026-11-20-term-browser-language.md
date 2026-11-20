# Term Browser Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render translated term names in `lib-jds-term-browser` for a consumer-chosen language, falling back to the canonical name.

**Architecture:** Type the `translations` the JAX API already returns and normalise their codes in `JaxOntologyService`; mirror the type on `JdsTerm`, add a pure `termName` helper, and drive it from a new `language` input. Language never touches the facade or the `tree` binding, so expansion state survives a switch.

**Tech Stack:** Angular 21 signals, RxJS, Jest, Nx (`components`, `api-clients` projects).

**Spec:** `docs/superpowers/specs/2026-11-20-term-browser-language-design.md`

## Global Constraints

- Branch `HPO-218`, based on `origin/main`.
- Component stays free of services; no language state in `JdsTermBrowserFacade`.
- Sibling order stays on canonical `name` (both `asNodes` and `buildTermTree`).
- `language` (term content) is documented separately from `labels` (component UI text).
- Load the `code-documentation` skill before writing `termName` or the normaliser; follow existing TSDoc style (`@param name - description`).
- Commits: Conventional Commits with `(api-clients)` / `(term-browser)` scope, ending with the repo's Co-Authored-By line.

## Review Focus

- Translation with `name: ''` (common in the live API) → canonical name, not a blank row. Pinned in Task 2.
- Language code in a different case from the data (`'DE'` vs `'de'`, or unnormalised data from another client) → still matches. Pinned in Task 2.
- Language switched while rows are expanded / lazily resolved → nothing collapses, no refetch. Pinned in Task 3.
- Term with no `translations` field at all (OLS, hand-built trees) → canonical name, no error. Pinned in Task 2.
- Language not present on a given term while present on its neighbours → that row alone falls back, without a `lang` attribute. Pinned in Task 3.

---

### Task 1: Type and normalise translations in api-clients

**Files:**
- Modify: `libs/api-clients/src/lib/services/ontology/ontology.model.ts`
- Modify: `libs/api-clients/src/lib/services/ontology/ontology.service.jax.ts` (`term()`, `relation()`)
- Test: `libs/api-clients/src/lib/services/ontology/ontology.service.jax.spec.ts`
- Modify: `libs/api-clients/CHANGELOG.md` (Unreleased → Added)

**Interfaces:**
- Produces:
  ```ts
  export interface OntologyTermTranslation {
    language: string;      // lowercase code once through JaxOntologyService
    name: string;          // '' when the translation has no name
    definition?: string;
    status?: string;
  }
  // on OntologyTerm:
  translations?: OntologyTermTranslation[];
  ```

- [ ] **Step 1: Write the failing tests** in the existing `describe('JaxOntologyService')`:
  - `it('lowercases translation language codes on a term')` — flush `{ id: ID, name: 'Arachnodactyly', translations: [{ language: 'DE', name: 'Spinnenfingrigkeit', definition: '', status: 'CANDIDATE' }] }` for `service.term(ID)`; expect `response.object?.translations?.[0].language` toBe `'de'` and `name` unchanged.
  - `it('lowercases translation language codes on related terms')` — same for `service.children(ID)` flushing `[{ id: 'HP:1', name: 'x', translations: [{ language: 'TR', name: 'y' }] }]`; expect `'tr'`.
  - `it('leaves a term without translations untouched')` — flush `{ id: ID, name: 'Arachnodactyly' }`; expect `response.object?.translations` toBeUndefined.
- [ ] **Step 2: Run** `npx nx test api-clients --testFile=ontology.service.jax.spec.ts` — expect the two lowercase tests to FAIL (`'DE'` received).
- [ ] **Step 3: Implement.** Add the interface + field to `ontology.model.ts`. In `ontology.service.jax.ts` add `private normalise(term: OntologyTerm): OntologyTerm` returning a copy whose `translations` (when present) have `language.toLowerCase()`; apply it in `term()` and in `relation()` (`data.map(...)`). Do not touch `search()` or the OLS service.
- [ ] **Step 4: Run** the same command — expect PASS; then `npx nx test api-clients` — all green.
- [ ] **Step 5: Changelog** — add under the api-clients Unreleased section: `OntologyTerm.translations`, codes lowercased by `JaxOntologyService`.
- [ ] **Step 6: Commit** — `feat(api-clients): type ontology term translations and lowercase their codes`

---

### Task 2: `termName` helper and `JdsTerm.translations`

**Files:**
- Modify: `libs/components/src/lib/term-browser/term-browser.model.ts`
- Create: `libs/components/src/lib/term-browser/term-browser.model.spec.ts`

**Interfaces:**
- Consumes: shape of `OntologyTermTranslation` from Task 1 (redeclared locally, not imported — the model must not depend on api-clients).
- Produces:
  ```ts
  export interface JdsTermTranslation { language: string; name: string; definition?: string; status?: string; }
  // on JdsTerm:
  translations?: JdsTermTranslation[];
  export function termName(term: JdsTerm, language: string | null | undefined): string;
  /** Code of the translation termName used, or null when it fell back. */
  export function termLanguage(term: JdsTerm, language: string | null | undefined): string | null;
  ```
  Already exported via `libs/components/src/index.ts` (`export * from './lib/term-browser/term-browser.model'`).

- [ ] **Step 1: Write the failing tests** in `term-browser.model.spec.ts`, using
  `const term: JdsTerm = { id: 'HP:1', name: 'Seizure', translations: [{ language: 'de', name: 'Krampfanfall' }, { language: 'fr', name: '' }] };`
  - `termName(term, 'de')` → `'Krampfanfall'`; `termLanguage(term, 'de')` → `'de'`
  - `termName(term, 'DE')` → `'Krampfanfall'` (case-insensitive)
  - `termName(term, 'fr')` → `'Seizure'`; `termLanguage(term, 'fr')` → `null` (empty name falls back)
  - `termName(term, 'ja')` → `'Seizure'`; `termLanguage` → `null`
  - `termName(term, null)` → `'Seizure'`
  - `termName({ id: 'HP:2', name: 'Plain' }, 'de')` → `'Plain'` (no `translations` field)
- [ ] **Step 2: Run** `npx nx test components --testFile=term-browser.model.spec.ts` — expect FAIL (`termName` is not exported).
- [ ] **Step 3: Implement** the interface, the field, and both functions in `term-browser.model.ts`. `termLanguage` finds the translation as in the spec's `termName` sketch and returns its `language` only when its `name` is non-empty; `termName` is `termLanguage(...) ? <that name> : term.name` (share one private finder).
- [ ] **Step 4: Run** the same command — expect PASS.
- [ ] **Step 5: Commit** — `feat(term-browser): add termName helper and JdsTerm translations`

---

### Task 3: `language` input on the component

**Files:**
- Modify: `libs/components/src/lib/term-browser/term-browser.component.ts`
- Modify: `libs/components/src/lib/term-browser/term-browser.component.html` (name span, ~line 54)
- Test: `libs/components/src/lib/term-browser/term-browser.component.spec.ts`

**Interfaces:**
- Consumes: `termName`, `termLanguage`, `JdsTermTranslation` from Task 2.
- Produces: `language = input<string | null>(null)`; public `nameOf(term: JdsTerm): string` and `langOf(term: JdsTerm): string | null` used by the template.

- [ ] **Step 1: Write the failing tests** in the existing `describe`, with a fixture built from `node(...)` whose terms carry translations (e.g. `All` → `{ language: 'de', name: 'Alle' }`, `Long fingers` → `{ language: 'de', name: 'Lange Finger' }`, `Slender finger` → no `de` translation):
  - `it('renders the translated name for the chosen language')` — `setInput('language', 'de')`; row text contains `'Alle'` and `'Lange Finger'`, and `'Slender finger'` for the untranslated row.
  - `it('marks translated names with their language and leaves fallbacks unmarked')` — the `Alle` name span has `lang="de"`; the `Slender finger` span has no `lang` attribute.
  - `it('renders canonical names when no language is set')` — default input; `'All'` rendered, no `lang` attributes.
  - `it('keeps expansion and resolved children when the language changes')` — render, toggle a row collapsed and open a lazily resolved one (use the existing `resolver` mock), `resolver.mockClear()`, then `setInput('language', 'de')` + `detectChanges()`; expect the same `rows().length` and `aria-expanded` values as before, and `resolver` not called.
  - `it('matches typeahead against the shown name')` — tree with roots `Hands` and `Toes`, where `Toes` carries `{ language: 'de', name: 'Zehen' }`; with `language` `'de'`, keydown `'z'` on the `Hands` row moves `activeKey()` to the `Toes` row's key.
  - `it('keeps sibling order on the canonical name when translated')` — two lazily resolved children `{ name: 'B', translations: [{ language: 'de', name: 'Z' }] }`, `{ name: 'C', translations: [{ language: 'de', name: 'A' }] }`; with `language` `'de'`, rendered order is `Z`, `A`.
- [ ] **Step 2: Run** `npx nx test components --testFile=term-browser.component.spec.ts` — expect the new tests to FAIL (`language` is not an input).
- [ ] **Step 3: Implement.** Add the input next to `labels` with TSDoc stating it selects term-content translations, falls back per term, and is unrelated to `labels`. Add `nameOf` / `langOf` delegating to Task 2 with `this.language()`. In `onTypeahead` match on `this.nameOf(row.node.term)`. Leave `asNodes` sorting on `a.name`. Template: `<span class="group-hover:tw-underline" [attr.lang]="langOf(row.node.term)">{{ nameOf(row.node.term) }}</span>`.
- [ ] **Step 4: Run** the same command — expect PASS; then `npx nx test components` and `npx nx lint components` — green.
- [ ] **Step 5: Commit** — `feat(term-browser): render translated names for a language input`

---

### Task 4: Docs and changelog

**Files:**
- Modify: `libs/components/src/lib/term-browser/term-browser.docs.ts`
- Modify: `libs/components/CHANGELOG.md` (Unreleased → Added)

**Interfaces:**
- Consumes: `language` input, `termName` (Tasks 2–3).

- [ ] **Step 1: Docs** — add a `variations` entry `id: 'language'`, `title: 'Language'`, `language: 'html'`, describing: pass a lowercase code to `language`; each row falls back to its canonical name when it has no translation; order stays canonical; the consumer owns the list of languages and their display names; `labels` translates the component's own text, not terms. Code sample binds `[language]="selectedLanguage()"` alongside the existing facade bindings. If the live demo has a host component, leave it unchanged (out of scope).
- [ ] **Step 2: Changelog** — components Unreleased → Added: `**Term Browser**: \`language\` input renders translated term names when a translation exists, falling back per term; \`termName\` helper exported`.
- [ ] **Step 3: Verify** `npx nx build components` and `npx nx build api-clients` succeed.
- [ ] **Step 4: Commit** — `docs(term-browser): document language input`
