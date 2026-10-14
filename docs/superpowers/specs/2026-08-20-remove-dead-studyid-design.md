# IS-770 Remove Dead StudyId — Design

## Summary

Jira ticket IS-770 ("Remove Dead StudyId from model") removes the study ID from
the ISA visualization request path and from the response models that describe it.
On the frontend this means dropping the `studyIds` parameter from all three
`ISADataService` methods, dropping the corresponding query-string entries, and
deleting the three `study_id` fields from `isa-data.model.ts`.

The backend half of the ticket is being implemented in the
`data-orchestration-service` repo on branch `IS-770-remove-dead-studyid-from-model`.

## Context

`ISADataService` (`libs/api-clients/src/lib/services/isa-data/isa-data.service.ts`)
calls two live visualization endpoints and holds one placeholder:

| Method | Endpoint | Study query param |
|---|---|---|
| `getMeasureSeriesMetadata` | `/visualization/measures/metadata` | `studyId` (singular) |
| `getMeasureSeriesCharacteristics` | `/visualization/measures/characteristics` | `studyIds` (plural) |
| `getMeasuresMetadata` | none — returns an empty URL | n/a, param accepted but unused |

Both JSDoc blocks have carried the note "REQUIRED!! WILL BE REMOVED IN THE FUTURE"
since the service was written.

### Confirmed backend behavior

The following was confirmed against the backend branch and its committed design
doc, not inferred:

1. **The request-side removal is non-breaking, in either direction.** Every
   visualization handler already declares a
   `@RequestParam(required = false) Map<String, String> allParams` catch-all, so a
   stale `studyId` binds there harmlessly; Spring MVC also ignores query params
   that bind to nothing. A stale value is **ignored, never rejected** — no 400.
   The frontend can therefore ship before, with, or after the backend.

2. **Only one of the three `study_id` model fields was ever returned by the API.**
   A grep of every DTO in the backend visualization path found `study_id` on
   exactly one response class, `MeasureSetMetadata`, which is being deleted:

   | Frontend interface | Returned by the API? |
   |---|---|
   | `MeasureSeriesMetadata.study_id?: number` | Yes — being removed by the backend |
   | `MeasureValue.study_id?: string` | Never was |
   | `MeasureMetadata.study_id: string` (required) | Never was |


3. **Rollout order does not matter**, per (1). The backend is not yet merged or
   deployed, but the frontend does not need to wait on it.

## Approach

Hard removal: the parameter disappears from the signatures entirely, rather than
being kept as an ignored optional argument behind an `@deprecated` tag.

`@jax-data-science/api-clients` is published at `0.1.0-a.0`. Alpha, pre-1.0 is the
right place to take this break: a consumer gets a compile error pointing at the
exact call site, which beats a silently-ignored argument that keeps callers
believing they are scoping a request. A deprecation shim would also preserve the
precise dead weight the ticket asks us to remove.

## Changes

### 1. Service — `isa-data.service.ts`

- `getMeasureSeriesMetadata(measureSeriesIds: string[], studyIds: string[])`
  → `getMeasureSeriesMetadata(measureSeriesIds: string[])`
- `getMeasureSeriesCharacteristics(measureSeriesIds: string[], studyIds: string[])`
  → `getMeasureSeriesCharacteristics(measureSeriesIds: string[])`
- `getMeasuresMetadata(measureIds: string[], studyIds: string[])`
  → `getMeasuresMetadata(measureIds: string[])`
- Both `buildUrl` calls lose their study entry. Resulting URLs:
  - `/visualization/measures/metadata?measureSeriesIds=...`
  - `/visualization/measures/characteristics?measureSeriesIds=...`
  This resolves the `studyId`/`studyIds` singular-plural inconsistency by deleting
  it rather than picking a winner.
- Remove the `@param studyIds` JSDoc lines. **Keep** the `measureSeriesIds`
  "ONLY ONE ID IS SUPPORTED" notes — that constraint is unrelated and still true.
- The `!measureSeriesIds?.length` guards and their `ErrorResponse` throws are
  untouched.

`getMeasuresMetadata()` keeps existing as a placeholder; only its parameter is
removed. Deleting the method outright is a defensible cleanup but is not this
ticket — see Follow-ups.

### 2. Models — `isa-data.model.ts`

Delete all three `study_id` declarations:

- `MeasureSeriesMetadata.study_id?: number` — the API stops returning it.
- `MeasureValue.study_id?: string` — never returned by the API.
- `MeasureMetadata.study_id: string` — never returned by the API, and typed *required*,
  which forced any object literal of this type to invent a value for a field the
  API does not return. Removing a required field makes the type easier to satisfy,
  so this cannot break a consumer either.

All three removals are safe for consumers: two are optional, and the third is
required-but-unsatisfiable-in-good-faith.

### 3. Demo — `showcase-isa-data.component.ts`

Line 21: `getMeasureSeriesMetadata(['130499'], ['740'])` → `getMeasureSeriesMetadata(['130499'])`.
Must land in the same commit as the service change or the demo build fails.

### 4. Service docs — `isa-data.docs.ts`

Update the study references:

- `description` — drop "for a given study".
- `usageExamples[0].description` — drop "and study ID" from "Only a single measure
  series ID and study ID are currently supported."
- `usageExamples[0].code` — `loadMetadata(measureSeriesId: string)` and
  `getMeasureSeriesMetadata([measureSeriesId])`.
- `usage.dos[0]` — "Pass exactly one measure series ID — only single-ID lookups are
  currently supported."
- `usage.donts[0]` (the `getMeasuresMetadata()` warning) is still accurate — leave it.
- `tags: ['isa', 'metadata', 'studies']` — **leave `'studies'`**. The service is
  still ISA-domain and Study remains a concept in the data model; it just is not a
  request parameter.

### 5. Generated docs — `service-methods.generated.ts`

Not hand-edited. Regenerate with `pnpm docs:methods` and commit the result; the
three `signature` strings update themselves.

## Testing

No spec exists for `ISADataService` today. The other services in this library
(`mvar`, `asynctask`, `ontology`) carry thin "should be created" smoke tests.

The real regression risk here is the query string — a later edit could quietly
reintroduce a study param and nothing would catch it. Add
`libs/api-clients/src/lib/services/isa-data/isa-data.service.spec.ts` following the
existing `TestBed` + `provideHttpClient` pattern, but using `HttpTestingController`
to assert on the request URL:

- `getMeasureSeriesMetadata(['130499'])` issues a request to
  `/visualization/measures/metadata` whose query string contains `measureSeriesIds`
  and **neither** `studyId` **nor** `studyIds`.
- `getMeasureSeriesCharacteristics(['130499'])` — same assertion against
  `/visualization/measures/characteristics`.
- The existing empty-input guard still throws an `ErrorResponse` with
  `num_code: 400` for each of the two live methods.

Verification: `pnpm test`, `pnpm lint`, `pnpm build` all green before the work is
called done.

## Out of Scope

- No change to the `measureSeriesIds` single-ID constraint or the guard behavior.
- No change to `/visualization/measures/data` or the characteristics response
  shape; the backend confirms neither carries `study_id`.
- No deprecation shim or compatibility window (see Approach).
- No changes to the backend; that half is tracked on its own branch.

## Follow-ups (separate tickets)

- **`MeasureSeriesMetadata.method` is never returned by the API.** The backend
  serializes that field as `assay_name`, alongside a separate `assay_id`. This is a
  pre-existing model/API mismatch surfaced during IS-770 investigation, and is
  explicitly not part of this ticket.
- **Delete `getMeasuresMetadata()`.** It returns an empty URL, the docs already
  tell consumers not to call it, and it exists only as a placeholder for future API
  growth.
- **Consumer cleanup (mpd-ui).** `measures.facade.ts:49` and `:74` pass a hardcoded
  `studyId`; a third raw call at `:137` does the same outside this package. Pinned
  at `^0.0.1`, so nothing breaks until a deliberate bump. Deferred.