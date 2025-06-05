import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Ontology, OntologyConfig, OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class OntologyService {
  config_location = 'https://raw.githubusercontent.com/TheJacksonLaboratory/ontology-service/refs/heads/main/config/ontologies-internal.json'
  private config!: OntologyConfig[];

  /**
   * Get the configuration file from the source for the backend api service
   */
  constructor(private httpClient: HttpClient) {
    this.httpClient.get<OntologyConfig[]>(this.config_location).subscribe({
      next: (config) => this.config = config,
      error: () => {
        this.config = [];
      }
    });
  }

  /**
   * Search for terms in an ontology
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search
   */
  search(query: string, limit: number, ontology: Ontology): Observable<CollectionResponse<OntologyTerm>> {
    return this.httpClient.get<CollectionResponse<OntologyTerm>>(`${this.ontologyBaseResolver(ontology)}/search?q=${query}&limit=${limit}`);
  }

  /**
   * Get a term by its ID
   * @param id - the term ID
   */
  term(id: string): Observable<Response<OntologyTerm>>  {
    try {
      const url = `${this.ontologyBaseResolver(this.ontologyFromCurie(id))}/${id}`;
      return this.httpClient.get<Response<OntologyTerm>>(url);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Get the parents of a term
   * @param id - the term ID
   */
  parents(id: string): Observable<CollectionResponse<OntologyTerm>> {
    try {
      const url = `${this.ontologyBaseResolver(this.ontologyFromCurie(id))}/${id}/parents`;
      return this.httpClient.get<CollectionResponse<OntologyTerm>>(url);
    } catch (error) {
      return throwError(error)
    }
  }

  /**
   * Get the children of a term
   * @param id - the term ID
   */
  children(id: string): Observable<CollectionResponse<OntologyTerm>> {
    try {
      const url = `${this.ontologyBaseResolver(this.ontologyFromCurie(id))}/${id}/children`;
      return this.httpClient.get<CollectionResponse<OntologyTerm>>(url);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Get the ancestors of a term
   * @param id - the term ID
   */
  ancestors(id: string): Observable<CollectionResponse<OntologyTerm>> {
    try {
      const url = `${this.ontologyBaseResolver(this.ontologyFromCurie(id))}/${id}/ancestors`;
      return this.httpClient.get<CollectionResponse<OntologyTerm>>(url);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Get the descendants of a term
   * @param id - the term ID
   */
  descendants(id: string): Observable<CollectionResponse<OntologyTerm>> {
    try {
      const url = `${this.ontologyBaseResolver(this.ontologyFromCurie(id))}/${id}/descendants`;
      return this.httpClient.get<CollectionResponse<OntologyTerm>>(url);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Get the ontology from curie
   */
  ontologyFromCurie(curie: string): Ontology {
    return Ontology[curie.split(':')[0] as keyof typeof Ontology];
  }

  /**
   * Get the ontology api base url configuration
   **/
  ontologyBaseResolver(ontology: Ontology): string {
    if (!this.config || this.config.length === 0) {
      throw new Error('No ontology configuration found.');
    }
    const ontology_config = this.config.find((config) => config.prefix.toUpperCase() === ontology);

    if(!ontology_config) {
      throw new Error('Ontology not found in configuration.');
    }
    return ontology_config.api.base;
  }
}
