import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OntologyService } from './ontology.service.base';
import { Observable, defer, map } from 'rxjs';
import { OLSResponse, OLSTerm, OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../../models/response';
import { OntologyPrefixError, curieFromIri, prefixOf } from './ontology.shared';

@Injectable({
  providedIn: 'root'
})
export class OLSOntologyService extends OntologyService {
    private httpClient = inject(HttpClient);

    private OLS_SEARCH_BASE = 'https://www.ebi.ac.uk/ols4/api/v2/entities';
    private OLS_ENTITY_BASE = 'https://www.ebi.ac.uk/ols4/api/v2/ontologies';
    private PURL_BASE = 'http://purl.obolibrary.org/obo';

    /**
     * Get the ontology of a term id.
     * @param id - the term ID
     * @throws OntologyPrefixError when the id carries no ontology prefix
     */
    private ontologyOf(id: string): string {
        const prefix = prefixOf(id);
        if (!prefix) {
            throw new OntologyPrefixError(id);
        }
        return prefix.toLowerCase();
    }

    /**
     * Get the URL of a class resource.
     *
     * OLS addresses a class by its IRI embedded in the path, which must be encoded twice so
     * that the gateway and the application each decode it once.
     * @param id - the term ID
     * @param suffix - a relation path appended to the class, e.g. `/hierarchicalAncestors`
     */
    private classUrl(id: string, suffix = ''): string {
        const iri = `${this.PURL_BASE}/${id.replace(':', '_')}`;
        const encoded = encodeURIComponent(encodeURIComponent(iri));
        return `${this.OLS_ENTITY_BASE}/${this.ontologyOf(id)}/classes/${encoded}${suffix}`;
    }

    /**
     * Get the IRI of a relation entry, which is either a bare IRI or a wrapped value.
     * @param relation - the relation entry
     */
    private iriOf(relation: string | { value: string }): string {
        return typeof relation === 'string' ? relation : relation.value;
    }

    /**
     * Get a page of related classes.
     * @param id - the term ID
     * @param suffix - the relation path, e.g. `/children`
     */
    private collection(id: string, suffix: string): Observable<CollectionResponse<OntologyTerm>> {
        const params = new HttpParams()
            .set('includeObsoleteEntities', 'false')
            .set('size', '100')
            .set('lang', 'en');
        return defer(() => this.httpClient.get<OLSResponse>(this.classUrl(id, suffix), { params })).pipe(
            map(response => {
                const data = response.elements.map(olsTerm => this.mapOLSTermToOntologyTerm(olsTerm));
                return {
                    data,
                    paging: {
                        page: response.page,
                        items: data.length,
                        total_pages: response.totalPages,
                        total_items: response.totalElements
                    }
                };
            })
        );
    }

    /**
     * Get a term by its ID.
     * @param id - the term ID
     */
    term(id: string): Observable<Response<OntologyTerm>> {
        const params = new HttpParams().set('includeObsoleteEntities', 'false');
        return defer(() => this.httpClient.get<OLSTerm>(this.classUrl(id), { params })).pipe(
            map(olsTerm => ({ object: this.mapOLSTermToOntologyTerm(olsTerm) }))
        );
    }

    /**
     * Search for terms in an ontology.
     * @param query - the search query
     * @param limit - the number of results to return
     * @param ontology - the ontology to search, as its lowercase prefix, e.g. `hp`
     */
    search(query: string, limit: number, ontology: string): Observable<CollectionResponse<OntologyTerm>> {
        const params = new HttpParams()
            .set('search', query)
            .set('size', limit)
            .set('ontologyId', ontology.toLowerCase())
            .set('includeObsoleteEntities', 'false');
        return this.httpClient.get<OLSResponse>(this.OLS_SEARCH_BASE, { params }).pipe(
            map(response => {
                const data = response.elements
                    .filter(olsTerm => olsTerm.definedBy.includes(ontology.toLowerCase()))
                    .map(olsTerm => this.mapOLSTermToOntologyTerm(olsTerm));
                return {
                    data,
                    paging: {
                        page: response.page,
                        items: data.length,
                        total_pages: response.totalPages,
                        total_items: response.totalElements
                    }
                };
            })
        );
    }

    /**
     * Get the immediate parents of a term.
     *
     * OLS serves no parents relation, so the parents are read from the term itself and
     * resolved against the entities OLS inlines alongside it.
     * @param id - the term ID
     */
    parents(id: string): Observable<CollectionResponse<OntologyTerm>> {
        const params = new HttpParams().set('includeObsoleteEntities', 'false');
        return defer(() => this.httpClient.get<OLSTerm>(this.classUrl(id), { params })).pipe(
            map(olsTerm => {
                const data = (olsTerm.hierarchicalParent ?? [])
                    .map(parent => this.linked(olsTerm, this.iriOf(parent)))
                    .filter((parent): parent is OntologyTerm => parent !== undefined);
                return {
                    data,
                    paging: { page: 1, items: data.length, total_pages: 1, total_items: data.length }
                };
            })
        );
    }

    /**
     * Get the immediate children of a term.
     * @param id - the term ID
     */
    children(id: string): Observable<CollectionResponse<OntologyTerm>> {
        return this.collection(id, '/children');
    }

    /**
     * Get the ancestors of a term, each carrying the ids of its immediate parents.
     * @param id - the term ID
     */
    ancestors(id: string): Observable<CollectionResponse<OntologyTerm>> {
        return this.collection(id, '/hierarchicalAncestors');
    }

    /**
     * Get the descendants of a term.
     * @param id - the term ID
     */
    descendants(id: string): Observable<CollectionResponse<OntologyTerm>> {
        return this.collection(id, '/hierarchicalChildren');
    }

    /**
     * Get an entity that OLS inlined alongside a term.
     * @param olsTerm - the term carrying the inlined entities
     * @param iri - the IRI of the inlined entity
     * @returns the term, or undefined when OLS did not inline it
     */
    private linked(olsTerm: OLSTerm, iri: string): OntologyTerm | undefined {
        const entity = olsTerm.linkedEntities?.[iri];
        return entity ? this.mapOLSTermToOntologyTerm(entity) : undefined;
    }

    /**
     * Convert an OLS entity to a term.
     *
     * `parents` is left undefined when OLS supplies no hierarchical parents for the entity,
     * which is the case for the stub entities inlined under `linkedEntities`. The descendant
     * count decides which rows a tree can expand, so it is read from the hierarchical count
     * to match the relation the ancestors are read from.
     * @param olsTerm - the OLS entity
     */
    mapOLSTermToOntologyTerm(olsTerm: OLSTerm): OntologyTerm {
        const parents = olsTerm.hierarchicalParent
            ?.map(parent => curieFromIri(this.iriOf(parent)));
        const descendantCount = olsTerm.numHierarchicalDescendants ?? olsTerm.numDescendants;
        return {
            id: olsTerm.curie,
            name: olsTerm.label && olsTerm.label.length > 0 ? olsTerm.label[0] : 'No label',
            ...(descendantCount === undefined ? {} : { descendantCount }),
            ...(parents ? { parents } : {})
        };
    }
}
