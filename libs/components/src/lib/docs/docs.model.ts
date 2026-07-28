export type ComponentCategory =
  | 'Navigation'
  | 'Input'
  | 'Messaging'
  | 'Data Display'
  | 'Utilities';

/**
 * Fields shared by every documented "thing" (component or service) — what
 * the domain-agnostic Overview/Usage/Activity tab-content components and
 * DocsContextService key off of, regardless of which domain the doc
 * belongs to.
 */
export interface DocBase {
  name: string;
  slug: string;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  /** Short description shown on the Overview header card. */
  description: string;
  docsUrl?: string;
  /** Overview tab: usage guidance (do / don't panels). */
  usage: UsageDoc;
  /** Overview tab: activity section. */
  activity?: ActivityDoc;
}

/**
 * Front-matter for a documented component.
 *
 * Properties and variation code are hand-authored here for now; the plan is to
 * source properties from Compodoc JSON and variation code from raw imports
 * (`?raw`) in a later stage.
 * See docs/superpowers/specs/2026-06-29-component-page-design.md.
 */
export interface ComponentDoc extends DocBase {
  category: ComponentCategory;
  /** Class name Compodoc keys the generated Properties table by. */
  compodocSymbol: string;

  /** Overview tab: variation sections (live demo + code). */
  variations: VariationDoc[];

  /**
   * Properties tab fallback. Prefer the Compodoc-generated map
   * (COMPONENT_PROPERTIES, keyed by compodocSymbol); this is only used when no
   * generated entry exists.
   */
  properties?: ApiDoc;
  /** Theming tab: overridable CSS custom properties. */
  theming: ThemingVar[];
}

export interface VariationDoc {
  /**
   * Anchor id used by the right-side "On this page" TOC, and the key that ties
   * this variation to its generated code snippet (COMPONENT_SNIPPETS).
   */
  id: string;
  title: string;
  description: string;
  /** Fallback code; normally sourced from the generated snippet by `id`. */
  code?: string;
  language: 'html' | 'typescript';
}

export interface UsageDoc {
  summary: string;
  dos: string[];
  donts: string[];
}

export interface ActivityDoc {
  /** "Activity / Measure" copy; may later carry an image or visualization. */
  summary: string;
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

/** An overridable CSS custom property exposed by a component. */
export interface ThemingVar {
  variable: string;
  default: string;
  description: string;
}
