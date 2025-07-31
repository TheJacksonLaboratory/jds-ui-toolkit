import { Observable } from 'rxjs';
import { Ontology, OntologyTerm } from './ontology.model';
import { CollectionResponse, Response } from '../models/response';

export abstract class OntologyService {
  abstract search(query: string, limit: number, ontology: Ontology): Observable<CollectionResponse<OntologyTerm>>;
  abstract term(id: string): Observable<Response<OntologyTerm>>;
  abstract parents(id: string): Observable<CollectionResponse<OntologyTerm>>;
  abstract children(id: string): Observable<CollectionResponse<OntologyTerm>>;
  abstract ancestors(id: string): Observable<CollectionResponse<OntologyTerm>>;
  abstract descendants(id: string): Observable<CollectionResponse<OntologyTerm>>;
}