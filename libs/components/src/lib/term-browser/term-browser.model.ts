import { Observable } from 'rxjs';

/**
 * A term in an ontology.
 *
 * Structurally compatible with the api-clients `OntologyTerm`, so a tree built by
 * `buildTermTree` can be bound without mapping, while keeping the component free of any
 * dependency on a particular ontology client.
 */
export interface JdsTerm {
  /** Identifier of the term, conventionally a CURIE. */
  id: string;
  /** Label shown to the reader. */
  name: string;
  /** Size of the term's transitive subtree. A term reporting zero renders as a leaf. */
  descendantCount?: number;
}

/**
 * A term at one position in the tree.
 *
 * An ontology is a directed acyclic graph, so one term occupies as many positions as there
 * are routes to it. Positions are identified by {@link key}, never by the term id.
 */
export interface JdsTermTreeNode {
  /** The term occupying this position. */
  term: JdsTerm;
  /** Ids from the root down to and including this position. */
  path: string[];
  /** Stable identity of the position, used for expansion state. */
  key: string;
  /** Positions directly below this one. */
  children: JdsTermTreeNode[];
  /** Whether this position holds the term the tree was built for. */
  isFocus: boolean;
}

/** One rendered row, flattened from the tree so the DOM order matches the visual order. */
export interface JdsTermBrowserRow {
  /** The position this row renders. */
  node: JdsTermTreeNode;
  /** Depth below the root, starting at 1, for `aria-level`. */
  level: number;
  /** Position among its siblings, starting at 1, for `aria-posinset`. */
  posinset: number;
  /** Number of siblings, for `aria-setsize`. */
  setsize: number;
  /** Whether the row's children are shown, or undefined when the row cannot be expanded. */
  expanded?: boolean;
  /** Whether the row holds the selected term. */
  selected: boolean;
  /** Whether the row's children are being resolved. */
  loading: boolean;
}

/** Emitted when a term is chosen. */
export interface JdsTermSelectEvent {
  /** The chosen term. */
  term: JdsTerm;
  /** Ids from the root down to the chosen position. */
  path: string[];
}

/** Emitted when a position is expanded. */
export interface JdsTermExpandEvent {
  /** The term being expanded. */
  term: JdsTerm;
  /** Identity of the expanded position. */
  key: string;
}

/** Emitted when children could not be resolved. */
export interface JdsTermBrowserError {
  /** The term whose children were requested. */
  term: JdsTerm;
  /** The underlying failure. */
  cause: unknown;
}

/**
 * Resolves the immediate children of a term.
 * @param term - the term to expand
 */
export type JdsTermResolver = (term: JdsTerm) => Observable<JdsTerm[]> | Promise<JdsTerm[]>;

/** Text rendered by the component, for translation. */
export interface JdsTermBrowserLabels {
  /** Announced while children are being resolved. */
  loading: string;
  /** Shown when children could not be resolved. */
  error: string;
  /** Shown when there is no tree to render. */
  empty: string;
}

/** Text used when the consumer overrides nothing. */
export const JDS_TERM_BROWSER_LABELS: JdsTermBrowserLabels = {
  loading: 'Loading terms',
  error: 'Could not load terms',
  empty: 'No term selected'
};
