// ols-ontology.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OntologyService } from './ontology.service.base';
import { Observable, map, pipe } from 'rxjs';
import { OLSResponse, OLSTerm, Ontology, OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../../models/response';
import { ontologyFromCurie } from './ontology.shared';

@Injectable({
  providedIn: 'root'
})
export class OLSOntologyService extends OntologyService {
    private httpClient = inject(HttpClient);

    private OLS_SEARCH_BASE = 'https://www.ebi.ac.uk/ols4/api/v2/entities';
    private OLS_ENTITY_BASE = 'https://www.ebi.ac.uk/ols4/api/v2/ontologies';
    private PURL_BASE = 'http://purl.obolibrary.org/obo';

    constructor() {
        super();
    }

    term(id: string): Observable<Response<OntologyTerm>> {
        const ontology = ontologyFromCurie(id);
        const params = new URLSearchParams;
        params.set('includeObsoleteEntities', 'false');
        return this.httpClient.get<OLSTerm>(`${this.OLS_ENTITY_BASE}/${ontology.toLowerCase()}/classes/${this.PURL_BASE}/${id.replace(':', '_')}?${params.toString()}`).pipe(map(olsResponse => {
            return {
                object: this.mapOLSTermToOntologyTerm(olsResponse)
            };
        }));
    }

    search(query: string, limit: number, ontology: Ontology): Observable<CollectionResponse<OntologyTerm>> {

        const params = new URLSearchParams
        params.set('search', query);
        params.set('size', limit.toString());
        params.set('ontologyId', ontology.toLowerCase());
        params.set('includeObsoleteEntities', 'false');
        return this.httpClient.get<OLSResponse>(`${this.OLS_SEARCH_BASE}?${params.toString()}`).pipe(map(olsResponse => {
            const collectionResponse: CollectionResponse<OntologyTerm> = {
                data: olsResponse.elements.filter((olsTerm: OLSTerm) => olsTerm.definedBy.includes(ontology.toLowerCase())).map(olsTerm => this.mapOLSTermToOntologyTerm(olsTerm)),
                paging: {
                    page: olsResponse.page,
                    total_pages: olsResponse.totalPages,
                    total_items: olsResponse.totalElements
                }
            };
            return collectionResponse;
        }));
    }

    parents(id: string): Observable<CollectionResponse<OntologyTerm>> {
        const ontology = ontologyFromCurie(id);
        const params = new URLSearchParams;
        params.set('includeObsoleteEntities', 'false');
        return this.httpClient.get<OLSTerm>(`${this.OLS_ENTITY_BASE}/${ontology.toLowerCase()}/classes/${this.PURL_BASE}/${id.replace(':', '_')}?${params.toString()}`).pipe(map(olsTerm => {
            const data =  olsTerm.directParent
                    ? olsTerm.directParent
                        .map(parent =>
                            olsTerm.linkedEntities && olsTerm.linkedEntities[parent]
                                ? this.mapOLSTermToOntologyTerm(olsTerm.linkedEntities[parent])
                                : ""
                        ).filter(parent => parent !== "")
                    : []
            return {
                data: data,
                paging: {
                    page: 1,
                    total_pages: 1,
                    total_items: data.length
                }
            };
        }));
    }

    children(id: string): Observable<CollectionResponse<OntologyTerm>> {
        const ontology = ontologyFromCurie(id);
        const params = new URLSearchParams;
        params.set('includeObsoleteEntities', 'false');
        params.set('size', '100');
        params.set('lang', 'en');
        return this.httpClient.get<OLSResponse>(`${this.OLS_ENTITY_BASE}/${ontology.toLowerCase()}/classes/${this.PURL_BASE}/${id.replace(':', '_')}/children?${params.toString()}`).pipe(map(childrenResponse => {
            const data =  childrenResponse.elements.map(olsTerm => this.mapOLSTermToOntologyTerm(olsTerm));
            return {
                data: data,
                paging: {
                    page: childrenResponse.page,
                    total_pages: childrenResponse.totalPages,
                    total_items: data.length
                }
            };
        }));
    }

    ancestors(id: string): Observable<CollectionResponse<OntologyTerm>> {
        const ontology = ontologyFromCurie(id);
        const params = new URLSearchParams;
        params.set('includeObsoleteEntities', 'false');
        return this.httpClient.get<OLSTerm>(`${this.OLS_ENTITY_BASE}/${ontology.toLowerCase()}/classes/${this.PURL_BASE}/${id.replace(':', '_')}?${params.toString()}`).pipe(map(olsTerm => {
            const data =  olsTerm.directAncestor
                    ? olsTerm.directAncestor
                        .map(ancestor =>
                            olsTerm.linkedEntities && olsTerm.linkedEntities[ancestor]
                                ? this.mapOLSTermToOntologyTerm(olsTerm.linkedEntities[ancestor])
                                : ""
                        ).filter(ancestor => ancestor !== "")
                    : []
            return {
                data: data,
                paging: {
                    page: 1,
                    total_pages: 1,
                    total_items: data.length
                }
            };
        }));
    }

    // finish testing this method
    descendants(id: string): Observable<CollectionResponse<OntologyTerm>> {
        const ontology = ontologyFromCurie(id);
        const params = new URLSearchParams;
        params.set('includeObsoleteEntities', 'false');
        params.set('size', '100'); // max size for children endpoint
        params.set('lang', 'en');
        return this.httpClient.get<OLSResponse>(`${this.OLS_ENTITY_BASE}/${ontology.toLowerCase()}/classes/${this.PURL_BASE}/${id.replace(':', '_')}/hierarchicalChildren?${params.toString()}`).pipe(map(childrenResponse => {
            const data =  childrenResponse.elements.map(olsTerm => this.mapOLSTermToOntologyTerm(olsTerm));
            return {
                data: data,
                paging: {
                    page: childrenResponse.page,
                    total_pages: childrenResponse.totalPages,
                    total_items: data.length
                }
            };
        }));
    }

    mapOLSTermToOntologyTerm(olsTerm: OLSTerm): OntologyTerm {
        return {
            id: olsTerm.curie,
            name: olsTerm.label && olsTerm.label.length > 0 ? olsTerm.label[0] : 'No label'
        };
    }
}