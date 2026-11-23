# Navbar End Slot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let apps project their own content (e.g. HPO's "Copied Terms" clipboard) into the navbar's right-hand area.

**Architecture:** One `<ng-content select="[jdsNavbarEnd]" />` inside the navbar's `#end` template, ahead of the external link and auth controls. Docs/demo gain a variation; maintenance-only wording is removed.

**Tech Stack:** Angular (standalone), PrimeNG Menubar, Jest (jest-preset-angular), Nx.

**Spec:** `docs/superpowers/specs/2026-11-17-navbar-end-slot-design.md`

## Global Constraints
- Selector attribute name: `jdsNavbarEnd` (exact).
- No new `@Input`s, no new CSS/colors.
- Apps that project nothing see no change.

## Review Focus
- Nothing projected → end area renders exactly as before (external link + auth only). Pinned in Task 1.
- Projected content alongside `externalLink` → projected node comes before the link in DOM order. Pinned in Task 1.
- Mobile width / `mobileLogoPosition="center"` → projected content stays visible in the bar; manual check in Task 2 demo.

---

### Task 1: Projection slot in navbar

**Files:**
- Modify: `libs/components/src/lib/navbar/navbar.component.html` (`#end` template, ~line 89)
- Create: `libs/components/src/lib/navbar/navbar.component.spec.ts`

**Interfaces:**
- Produces: content projection selector `[jdsNavbarEnd]` on `lib-jds-navbar`.

- [ ] **Step 1: Write failing tests** — a host test component:
  ```html
  <lib-jds-navbar [externalLink]="link">
    <button jdsNavbarEnd data-testid="end-btn">Clip</button>
  </lib-jds-navbar>
  ```
  Tests (`provideRouter([])`, `provideNoopAnimations()` as needed):
  - `renders projected [jdsNavbarEnd] content in the menubar end area`: `querySelector('.p-menubar-end [data-testid="end-btn"]')` is truthy.
  - `places projected content before the external link`: with `link = 'https://x.org'`, `end-btn.compareDocumentPosition(externalAnchor) & Node.DOCUMENT_POSITION_FOLLOWING` is truthy.
  - `renders unchanged without projected content`: plain `<lib-jds-navbar externalLink="https://x.org">` → `.p-menubar-end a[href="https://x.org"]` exists and `.p-menubar-end [jdsNavbarEnd]` is null.
- [ ] **Step 2:** `npx nx test components --testFile=navbar.component.spec.ts` → first two FAIL.
- [ ] **Step 3:** Add `<ng-content select="[jdsNavbarEnd]" />` as first child of the `#end` flex div.
- [ ] **Step 4:** Re-run → all PASS.
- [ ] **Step 5:** Commit `feat(navbar): add jdsNavbarEnd content projection slot`.

### Task 2: Docs, demo, snippets

**Files:**
- Modify: `libs/components/src/lib/navbar/navbar.docs.ts`
- Modify: `apps/demo/src/app/components/pages/navbar/showcase-navbar.component.html` / `.ts`
- Regenerate: `apps/demo/src/app/docs-shell/generated/component-snippets.generated.ts`

- [ ] **Step 1:** `navbar.docs.ts`: remove "Maintenance only: bug fixes, no new features. New app chrome should come from a per-app design." from `description`; remove the "Do not extend Navbar…" don't; add a sentence to `description` about the `jdsNavbarEnd` slot; add variation `{ id: 'custom-end-content', title: 'Custom End Content', description: 'Project app-specific controls into the right side with the jdsNavbarEnd attribute.', language: 'html' }`; add do: "Use the jdsNavbarEnd slot for app-specific controls (e.g. a clipboard button) instead of forking Navbar."
- [ ] **Step 2:** Demo: add `#tplCustomEndContent` with `<!-- snippet:custom-end-content -->` wrapping `<lib-jds-navbar [title]="'My App'" [items]="demoItems"><p-button jdsNavbarEnd icon="pi pi-clipboard" [text]="true" ariaLabel="Copied terms" /></lib-jds-navbar>`; register it in `demoTemplates` the same way as the existing three (import `ButtonModule`).
- [ ] **Step 3:** `pnpm docs:snippets` → generated file gains `"custom-end-content"` entry.
- [ ] **Step 4:** `npx nx test components` and `npx nx build components` pass; `npx nx lint components demo` clean. Manually check demo at <960px width that the clipboard button stays visible.
- [ ] **Step 5:** Commit `docs(navbar): document jdsNavbarEnd slot, drop maintenance-only wording`.
