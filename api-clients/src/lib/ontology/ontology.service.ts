import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export enum Ontology {
  HP = 'Human Phenotype Ontology',
  MONDO = 'MONDO Disease Ontology',
  MP = 'Mamallian Phenotype Ontology',
  CL = 'Cell Ontology',
  MAXO = 'Medical Action Ontology'
}

export interface Term {}

export interface OntologyConfig {
  name: string;
  prefix: string;
  github: {
    api: string;
    home: string;
  };
  home: string;
  api: {
    docs: string;
    base: string;
  };
  base_file: string;
  international: boolean;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class OntologyService {
  private config_location = 'https://raw.githubusercontent.com/TheJacksonLaboratory/ontology-service/refs/heads/main/config/ontologies.json'
  private config: OntologyConfig[];

  /**
   * This is may not be the best way to implement configuration of this service. Must discuss.
   */
  constructor(private httpClient: HttpClient) {
    this.httpClient.get<OntologyConfig[]>(this.config_location).subscribe((data) => {
      this.config = data;
    });
  }

  /**
   * Search for terms in an ontology
   * @param query - the search query
   * @param limit - the number of results to return
   * @param ontology - the ontology to search
   * TODO: define the return type, implement pagination
   */
  search(query: string, limit: number, ontology: Ontology): Observable<any> {
    return this.httpClient.get<any>(`${this.ontologyBaseResolver(ontology)}/search?q=${query}&limit=${limit}`);
  }

  /**
   * Get a term by its ID
   * @param id - the term ID
   * @param ontology - the ontology to search
   * TODO: define the term type and location
   */
  term(id: string, ontology: Ontology): Observable<Term>  {
    return this.httpClient.get<Term>(`${this.ontologyBaseResolver(ontology)}/${id}`)
  }

  /**
   * Get the parents of a term
   * @param id - the term ID
   * @param ontology - the ontology to search
   */
  parents(id: string, ontology: Ontology): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`${this.ontologyBaseResolver(ontology)}/${id}/parents`);
  }

  /**
   * Get the children of a term
   * @param id - the term ID
   * @param ontology - the ontology to search
   */
  children(id: string, ontology: Ontology): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`${this.ontologyBaseResolver(ontology)}/${id}/children`);
  }

  /**
   * Get the ancestors of a term
   * @param id - the term ID
   * @param ontology - the ontology to search
   */
  ancestors(id: string, ontology: Ontology): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`${this.ontologyBaseResolver(ontology)}/${id}/ancestors`);
  }

  /**
   * Get the descendants of a term
   * @param id - the term ID
   * @param ontology - the ontology to search
   */
  descendants(id: string, ontology: Ontology): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`${this.ontologyBaseResolver(ontology)}/${id}/descendants`);
  }

  /**
   * Get the ontology api base url configuration
   **/
  private ontologyBaseResolver(ontology: Ontology): string {
    return this.config.find((config) => config.name === ontology).api.base;
  }

}
