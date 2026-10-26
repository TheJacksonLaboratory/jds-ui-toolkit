export interface OntologyTerm {
  id: string;
  name: string;
  /** Size of the term's transitive subtree, when the backend reports it. */
  descendantCount?: number;
  /**
   * Ids of the term's immediate parents.
   *
   * Populated by {@link OntologyService.ancestors}, so a set of ancestors describes its own
   * graph. Absent means the relation was not requested; an empty array means the term is a root.
   */
  parents?: string[];
}

// OLS Term interface based on provided JSON
export interface OLSTerm {
  appearsIn: string[];
  curie: string;
  definedBy: string[];
  definition?: Array<{
    type: string[];
    value: string;
    axioms?: Array<{ [key: string]: string }>
  }>;
  definitionProperty?: string;
  directAncestor?: string[];
  directParent?: Array<string>;
  hasDirectChildren?: boolean;
  hasDirectParents?: boolean;
  hasHierarchicalChildren?: boolean;
  hasHierarchicalParents?: boolean;
  hierarchicalAncestor?: string[];
  hierarchicalParent?: Array<string | {
    type: string[];
    value: string;
    axioms?: Array<{ [key: string]: string }>
  }>;
  hierarchicalProperty?: string;
  imported?: boolean;
  iri: string;
  isDefiningOntology?: boolean;
  isObsolete?: boolean;
  isPreferredRoot?: boolean;
  label?: string[];
  linkedEntities?: Record<string, any>;
  linksTo?: string[];
  numDescendants?: number;
  numHierarchicalDescendants?: number;
  ontologyId?: string;
  ontologyIri?: string;
  ontologyPreferredPrefix?: string;
  searchableAnnotationValues?: any[];
  shortForm?: string;
  type?: string[];
  [key: string]: any;
}

// OLS Response interface
export interface OLSResponse {
  page: number;
  numElements: number;
  totalPages: number;
  totalElements: number;
  elements: OLSTerm[];
  facetFieldsToCounts?: Record<string, any>;
}