import { Observable } from 'rxjs';
import { Ontology, OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../../models/response';

export abstract class OntologyService {
  /**
   * Search for terms in an ontology.
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search
   */
  abstract search(query: string, limit: number, ontology: Ontology): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get a term by its ID.
   * @param id - the term ID
   */
  abstract term(id: string): Observable<Response<OntologyTerm>>;

  /**
   * Get the parents of a term.
   * @param id - the term ID
   */
  abstract parents(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the children of a term.
   * @param id - the term ID
   */
  abstract children(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the ancestors of a term.
   * @param id - the term ID
   */
  abstract ancestors(id: string): Observable<CollectionResponse<OntologyTerm>>;

  /**
   * Get the descendants of a term.
   * @param id - the term ID
   */
  abstract descendants(id: string): Observable<CollectionResponse<OntologyTerm>>;
}
