export type ServiceCategory = 'Ontology' | 'Data Access' | 'Async Processing' | 'Genomics';

/**
 * `UsageDoc`/`ActivityDoc` below intentionally mirror
 * `libs/components/src/lib/docs/docs.model.ts`'s shapes field-for-field
 * instead of importing them: `libs/components` already depends on
 * `libs/api-clients` (AsyncTaskService, WorkflowExecutionStatus), so an
 * import in the other direction would create a circular project
 * dependency. Structural typing means `ServiceDoc` is still assignable
 * anywhere a `DocBase` is expected (e.g. `DocsContextService`) without
 * that import.
 */
export interface UsageDoc {
  summary: string;
  dos: string[];
  donts: string[];
}

export interface ActivityDoc {
  summary: string;
}

/** Front-matter for a documented API client service. */
export interface ServiceDoc {
  name: string;
  slug: string;
  category: ServiceCategory;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  /** Short description shown on the Overview header card. */
  description: string;
  docsUrl?: string;
  /** Class Compodoc keys the generated Methods table by — abstract or concrete. */
  compodocSymbol: string;

  /** Overview tab: one example per way of using this service (e.g. per implementation). */
  usageExamples: UsageExampleDoc[];
  /** Overview tab: usage guidance (do / don't panels). */
  usage: UsageDoc;
  /** Overview tab: activity section. */
  activity?: ActivityDoc;

  /**
   * Methods tab fallback. Prefer the Compodoc-generated map
   * (SERVICE_METHODS, keyed by compodocSymbol); this is only used when no
   * generated entry exists.
   */
  methods?: ApiMethodDoc;
}

export interface UsageExampleDoc {
  /** Anchor id used by the right-side "On this page" TOC. */
  id: string;
  title: string;
  description: string;
  /** Hand-authored — services have no live UI to derive a snippet from. */
  code: string;
  language: 'typescript';
}

export interface ApiMethodDoc {
  methods: ApiMethod[];
}

export interface ApiMethod {
  name: string;
  /** Rendered signature, e.g. `search(query: string, limit: number, ontology: Ontology)`. */
  signature: string;
  returnType: string;
  description: string;
}
