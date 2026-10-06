import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, defer, map } from 'rxjs';
import { OntologyTerm } from './ontology.model';

import { CollectionResponse, Response } from '../../models/response';
import { OntologyPrefixError, prefixOf } from './ontology.shared';
import { OntologyService } from './ontology.service.base';

/** Body returned by the ontology-service search route. */
interface JaxSearchResponse {
  terms: OntologyTerm[];
  totalCount: number;
}

/**
 * Root URL shared by every ontology-service deployment, without a trailing slash.
 *
 * Each ontology is a separate deployment addressed by its lowercase prefix, so
 * `https://ontology.jax.org/api` serves `…/api/hp`, `…/api/mp` and so on.
 */
export const JAX_ONTOLOGY_API_ROOT = new InjectionToken<string>('JAX_ONTOLOGY_API_ROOT', {
  providedIn: 'root',
  factory: () => 'https://ontology.jax.org/api',
});

@Injectable({
  providedIn: 'root'
})
export class JaxOntologyService extends OntologyService {
  private httpClient = inject(HttpClient);
  private root = inject(JAX_ONTOLOGY_API_ROOT).replace(/\/+$/, '');

  /**
   * Get the base URL of an ontology's deployment.
   * @param ontology - the ontology prefix, in any case
   */
  private base(ontology: string): string {
    return `${this.root}/${ontology.toLowerCase()}`;
  }

  /**
   * Get the URL of a term resource, resolving the deployment from the term's own prefix.
   * @param id - the term ID
   * @param suffix - a relation path appended to the term, e.g. `/parents`
   * @throws OntologyPrefixError when the id carries no ontology prefix
   */
  private termUrl(id: string, suffix = ''): string {
    const prefix = prefixOf(id);
    if (!prefix) {
      throw new OntologyPrefixError(id);
    }
    return `${this.base(prefix)}/terms/${encodeURIComponent(id)}${suffix}`;
  }

  /**
   * Get a collection of terms related to a term.
   * @param id - the term ID
   * @param suffix - the relation path, e.g. `/parents`
   */
  private relation(id: string, suffix: string): Observable<CollectionResponse<OntologyTerm>> {
    return defer(() => this.httpClient.get<OntologyTerm[]>(this.termUrl(id, suffix))).pipe(
      map(data => ({ data }))
    );
  }

  /**
   * Search for terms in an ontology.
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search, as its lowercase prefix, e.g. `hp`
   */
  search(query: string, limit: number, ontology: string): Observable<CollectionResponse<OntologyTerm>> {
    const params = new HttpParams().set('q', query).set('limit', limit);
    return this.httpClient.get<JaxSearchResponse>(`${this.base(ontology)}/search`, { params }).pipe(
      map(({ terms, totalCount }) => ({
        data: terms,
        paging: { page: 1, items: terms.length, total_pages: 1, total_items: totalCount }
      }))
    );
  }

  /**
   * Get a term by its ID.
   * @param id - the term ID
   */
  term(id: string): Observable<Response<OntologyTerm>> {
    return defer(() => this.httpClient.get<OntologyTerm>(this.termUrl(id))).pipe(
      map(object => ({ object }))
    );
  }

  /**
   * Get the immediate parents of a term.
   * @param id - the term ID
   */
  parents(id: string): Observable<CollectionResponse<OntologyTerm>> {
    return this.relation(id, '/parents');
  }

  /**
   * Get the immediate children of a term.
   * @param id - the term ID
   */
  children(id: string): Observable<CollectionResponse<OntologyTerm>> {
    return this.relation(id, '/children');
  }

  /**
   * Get the ancestors of a term, each carrying the ids of its immediate parents.
   * @param id - the term ID
   */
  ancestors(id: string): Observable<CollectionResponse<OntologyTerm>> {
    return this.relation(id, '/ancestors');
  }

  /**
   * Get the descendants of a term.
   * @param id - the term ID
   */
  descendants(id: string): Observable<CollectionResponse<OntologyTerm>> {
    return this.relation(id, '/descendants');
  }
}
