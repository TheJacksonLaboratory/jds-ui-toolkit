# buildTermTree drops a path when a parent also parents another ancestor

- **Where:** `libs/api-clients/src/lib/services/ontology/ontology.tree.ts`
- **Found by:** Copilot review on [PR #67](https://github.com/TheJacksonLaboratory/jds-ui-toolkit/pull/67#discussion_r4328105748), reproduced 2026-10-20
- **Status:** open, not fixed

## What happens

`buildTermTree` does not use the focus term's own parent edges. It infers which ancestors
are direct parents of the focus with this rule:

```ts
// An ancestor with no child among the ancestors reaches the focus term directly.
for (const term of ancestors) {
  if (!childrenOf.has(term.id)) {
    childrenOf.set(term.id, [focus.id]);
  }
}
```

An ancestor that is a direct parent of the focus **and** a parent of another ancestor
already has an entry in `childrenOf`, so the focus is never attached below it. That route
disappears from the tree and `pathCount` under-reports.

## Reproduction

Focus `F` with `parents: ['A', 'B']`, ancestors `A` (a root) and `B` (child of `A`):

```ts
const focus = { id: 'F', name: 'Focus', parents: ['A', 'B'] };
const ancestors = [
  { id: 'A', name: 'A', parents: [] },
  { id: 'B', name: 'B', parents: ['A'] }
];
buildTermTree(focus, ancestors);
```

Produces one path where there should be two:

```
pathCount = 1

A
└── B
    └── F        A → F is missing, though focus.parents names A
```

Expected `pathCount = 2`, with `F` rendered below both `A` and `A > B`.

## Fix

Attach the focus below each id in `focus.parents` instead of inferring, keeping the current
inference only as the fallback for a term response that omits `parents`.

Two things to settle before doing it:

- **The JAX backend.** `IS-856-ancestors-parent-ids` adds parent ids to the *ancestors*
  route of ontology-service. Check whether `/terms/{id}` carries `parents` too — if it does
  not, the JAX path silently keeps the inference and the fix only helps OLS.
- **Release.** The change is in `libs/api-clients`, so it needs a release and a peer-range
  bump in `libs/components` before the term browser benefits.

## Does it occur in HPO?

Unknown. The shape needs a term whose parent list includes both a term and that term's own
parent, which HPO's asserted hierarchy generally avoids as a redundant edge. Not checked
against real data — worth measuring before prioritising, since it may be unreachable for
HPO while mattering for MONDO.
