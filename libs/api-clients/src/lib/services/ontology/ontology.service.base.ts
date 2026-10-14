import { Observable } from 'rxjs';
import { OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../../models/response';

export abstract class OntologyService {
  /**
   * Search for terms in an ontology.
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search, as its lowercase prefix, e.g. `hp`
   */
  abstract search(query: string, limit: number, ontology: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get a term by its ID.
   * @param id - the term ID
   */
  abstract term(id: string): Observable<Response<OntologyTerm>>;

  /**
   * Get the immediate parents of a term.
   * @param id - the term ID
   */
  abstract parents(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the immediate children of a term.
   * @param id - the term ID
   */
  abstract children(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the ancestors of a term.
   *
   * Every returned term populates {@link OntologyTerm.parents}, so the result describes the
   * ancestor sub-graph rather than a flat set. Implementations that cannot supply parents
   * cannot be used to build a term tree.
   * @param id - the term ID
   */
  abstract ancestors(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the descendants of a term.
   * @param id - the term ID
   */
  abstract descendants(id: string): Observable<CollectionResponse<OntologyTerm>>;
}
