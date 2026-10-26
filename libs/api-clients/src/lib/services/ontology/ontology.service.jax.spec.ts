import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OntologyTerm } from './ontology.model';
import { JAX_ONTOLOGY_API_ROOT, JaxOntologyService } from './ontology.service.jax';
import { OntologyPrefixError } from './ontology.shared';

const ROOT = 'https://ontology.jax.org/api';
const ID = 'HP:0001166';
const ENCODED = encodeURIComponent(ID);

describe('JaxOntologyService', () => {
  let service: JaxOntologyService;
  let httpTestingController: HttpTestingController;

  const configure = (root?: string) => {
    TestBed.configureTestingModule({
      providers: [
        JaxOntologyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        ...(root ? [{ provide: JAX_ONTOLOGY_API_ROOT, useValue: root }] : [])
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(JaxOntologyService);
  };

  beforeEach(() => configure());
  afterEach(() => httpTestingController.verify());

  it('should create without fetching any configuration', () => {
    expect(service).toBeTruthy();
    httpTestingController.expectNone(() => true);
  });

  it('should address a term under the ontology of its own prefix', done => {
    service.term(ID).subscribe(response => {
      expect(response.object?.name).toEqual('Arachnodactyly');
      done();
    });
    const req = httpTestingController.expectOne(`${ROOT}/hp/terms/${ENCODED}`);
    expect(req.request.method).toEqual('GET');
    req.flush({ id: ID, name: 'Arachnodactyly' });
  });

  it('should map the search body onto a collection response', done => {
    service.search('arachno', 2, 'hp').subscribe(response => {
      expect(response.data.map(t => t.id)).toEqual(['HP:0001166']);
      expect(response.paging?.total_items).toEqual(42);
      done();
    });
    const req = httpTestingController.expectOne(
      r => r.url === `${ROOT}/hp/search` && r.params.get('q') === 'arachno' && r.params.get('limit') === '2'
    );
    req.flush({ terms: [{ id: ID, name: 'Arachnodactyly' }], totalCount: 42 });
  });

  it.each([
    ['parents', (s: JaxOntologyService) => s.parents(ID)],
    ['children', (s: JaxOntologyService) => s.children(ID)],
    ['ancestors', (s: JaxOntologyService) => s.ancestors(ID)],
    ['descendants', (s: JaxOntologyService) => s.descendants(ID)]
  ])('should wrap the bare %s array in a collection response', (relation, call) => {
    let received: OntologyTerm[] | undefined;
    call(service).subscribe(response => (received = response.data));
    const req = httpTestingController.expectOne(`${ROOT}/hp/terms/${ENCODED}/${relation}`);
    req.flush([{ id: 'HP:0001167', name: 'Abnormal finger morphology' }]);
    expect(received?.map(t => t.id)).toEqual(['HP:0001167']);
  });

  it('should preserve the parent ids carried by ancestors', done => {
    service.ancestors(ID).subscribe(response => {
      expect(response.data[0].parents).toEqual(['HP:0000001']);
      expect(response.data[1].parents).toEqual([]);
      done();
    });
    httpTestingController.expectOne(`${ROOT}/hp/terms/${ENCODED}/ancestors`).flush([
      { id: 'HP:0000118', name: 'Phenotypic abnormality', parents: ['HP:0000001'] },
      { id: 'HP:0000001', name: 'All', parents: [] }
    ]);
  });

  it('should fail the stream, not the caller, when the id carries no prefix', done => {
    service.term('notacurie').subscribe({
      error: error => {
        expect(error).toBeInstanceOf(OntologyPrefixError);
        done();
      }
    });
  });

  it('should honour an overridden API root', () => {
    TestBed.resetTestingModule();
    configure('https://staging.example.org/api/');
    service.term(ID).subscribe();
    httpTestingController.expectOne(`https://staging.example.org/api/hp/terms/${ENCODED}`).flush({});
  });
});
