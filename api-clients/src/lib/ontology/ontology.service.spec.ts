import {HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Ontology, OntologyConfig, OntologyTerm } from '../async-tasks/models/ontology';
import { CollectionResponse, Response } from '../async-tasks/models/response';
import { OntologyService } from './ontology.service';

describe('OntologyService', () => {
  let service: OntologyService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [OntologyService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OntologyService);
  });

  afterEach(() => {httpTestingController.verify();})

  it('should create', () => {
    const req = httpTestingController.expectOne(service.config_location);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
    expect(service).toBeTruthy();
  });

  it('should get ontology from curie', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000001"
    const ontology = service.ontologyFromCurie(id);
    expect(ontology).toEqual(Ontology.HP);
  });

  it('should fail to get ontology from curie', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "BAD:0000001"
    const ontology = service.ontologyFromCurie(id);
    console.log(ontology);
    expect(ontology).toBeUndefined();
  });

  it('should get the fake configuration string', () => {
    flushFakeHpConfig(httpTestingController, service);
    expect(() => service.ontologyBaseResolver(Ontology.MP)).toThrowError('Ontology not found in configuration.');
  });

  it('should fail to get configuration string', () => {
    const req = httpTestingController.expectOne(service.config_location);
    expect(req.request.method).toEqual('GET');
    req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error'});

    expect(() => service.ontologyBaseResolver(Ontology.HP)).toThrowError('No ontology configuration found.');
  });

  it('should get some fake search results', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000001";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: id, name: "All"}]};
    service.search("testing", -1, Ontology.HP).subscribe(term => {
      expect(term).toEqual(fakeResponse);
    });
    const req = httpTestingController.expectOne(`${testOntologyConfig[0].api.base}/search?q=testing&limit=-1`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get the fake term', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000001";
    const fakeResponse: Response<OntologyTerm> = { object: { id: id, name: "All"}};
    service.term(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
    });
    const req = httpTestingController.expectOne(`${testOntologyConfig[0].api.base}/${id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get the fake term parents', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000002";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0000001', name: "All"}]};
    service.parents(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
    });
    const req = httpTestingController.expectOne(`${testOntologyConfig[0].api.base}/${id}/parents`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get the fake term children', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000002";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0000003', name: "Children Term"},
        { id: 'HP:0000004', name: "Sister Children Term"}]};
    service.children(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
    });
    const req = httpTestingController.expectOne(`${testOntologyConfig[0].api.base}/${id}/children`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get the fake term ancestors', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000004";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0000001', name: "All"},
        { id: 'HP:0000002', name: "Term 2"}]};
    service.ancestors(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
    });
    const req = httpTestingController.expectOne(`${testOntologyConfig[0].api.base}/${id}/ancestors`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get the fake term descendants', () => {
    flushFakeHpConfig(httpTestingController, service);
    const id = "HP:0000001";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0000002', name: "Term 2"},
        { id: 'HP:0000003', name: "Children Term"}, { id: 'HP:0000004', name: "Sister Children Term"}]};
    service.descendants(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
    });
    const req = httpTestingController.expectOne(`${testOntologyConfig[0].api.base}/${id}/descendants`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });
});


const testOntologyConfig: OntologyConfig[] = [{
  name: "Human Phenotype Ontology",
  prefix: "hp",
  github: {
    api: "https://api.github.com/repos/obophenotype/human-phenotype-ontology",
    home: "https://github.com/obophenotype/human-phenotype-ontology"
  },
  home: "http://human-phenotype-ontology.org",
  api: {
    docs: "http://human-phenotype-ontology.org/api/docs",
    base: "http://human-phenotype-ontology.org/api"
  },
  base_file: "hp.obo",
  international: true,
  description: "The Human Phenotype Ontology (HPO) provides a standardized vocabulary of phenotypic abnormalities encountered in human disease."
}];

function flushFakeHpConfig<T>(httpTestingController: HttpTestingController, service: T) {
  const req = httpTestingController.expectOne(service.config_location);
  expect(req.request.method).toEqual('GET');
  req.flush(testOntologyConfig);
}
