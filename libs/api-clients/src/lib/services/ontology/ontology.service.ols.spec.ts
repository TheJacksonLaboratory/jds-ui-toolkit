import {HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OLSResponse, Ontology, OntologyTerm} from './ontology.model';
import { CollectionResponse, Response } from '../../models/response';
import { OLSOntologyService } from './ontology.service.ols'

describe('OLSOntologyService', () => {
  let service: OLSOntologyService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [OLSOntologyService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OLSOntologyService);
  });

  afterEach(() => {httpTestingController.verify();})

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get some fake search results', (done) => {
    const id = "HP:0000873";
    service.search("testing", -1, Ontology.HP).subscribe(term => {
      expect(term).toEqual(testOLSTransformedSearch);
      done();
    });
    const req = httpTestingController.expectOne(`https://www.ebi.ac.uk/ols4/api/v2/entities?search=testing&size=-1&ontologyId=hp&includeObsoleteEntities=false`);
    expect(req.request.method).toEqual('GET');
    req.flush(testOLSResponseSearch);
  });

  it('should get the fake term', (done) => {
    const id = "HP:0001166";
    const fakeResponse: Response<OntologyTerm> = { object: { id: id, name: "Arachnodactyly"}};
    service.term(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
      done()
    });
    const req = httpTestingController.expectOne(`https://www.ebi.ac.uk/ols4/api/v2/ontologies/hp/classes/http://purl.obolibrary.org/obo/HP_0001166?includeObsoleteEntities=false`);
    expect(req.request.method).toEqual('GET');
    req.flush(testOLSResponseTerm);
  });

  // it('should fail to get the fake term', () => {
  //   flushBrokenConfig(httpTestingController, service);
  //   const id = "HP:0000001";
  //   const fakeResponse: Response<OntologyTerm> = { object: { id: id, name: "All"}};
  //   service.term(id).subscribe( {
  //     next: (term) =>  expect(term).toEqual(fakeResponse),
  //     error: (error) => expect(error).toEqual('No ontology configuration found.')
  //   });
  // });

  it('should get the fake term parents', (done) => {
    const id = "HP:0001166";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0001238', name: "Slender finger"}, { id: 'HP:0100807', name: "Long fingers"}], paging: { page: 1, total_pages: 1, total_items: 2 }};
    service.parents(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
      done();
    });
    const req = httpTestingController.expectOne(`https://www.ebi.ac.uk/ols4/api/v2/ontologies/hp/classes/http://purl.obolibrary.org/obo/HP_0001166?includeObsoleteEntities=false`);
    expect(req.request.method).toEqual('GET');
    req.flush(testOLSResponseTerm);
  });

  it('should get the fake term children', (done) => {
    const id = "HP:0100807";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0001182', name: "Tapered finger"}, { id: 'HP:0001166', name: "Arachnodactyly"}], paging: { page: 0, total_pages: 1, total_items: 2 }};
    service.children(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
      done();
    });
    const req = httpTestingController.expectOne(`https://www.ebi.ac.uk/ols4/api/v2/ontologies/hp/classes/http://purl.obolibrary.org/obo/HP_0100807/children?includeObsoleteEntities=false&size=100&lang=en`);
    expect(req.request.method).toEqual('GET');
    req.flush(testOLSResponseChildren);
  });

  it('should get the fake term ancestors', (done) => {
    const id = "HP:0001166";
    const fakeResponse: CollectionResponse<OntologyTerm> = {data: [
      { id: "HP:0001238", name: "Slender finger" },
      { id: "HP:0001167", name: "Abnormal finger morphology" },
      { id: "HP:0001155", name: "Abnormality of the hand" },
      { id: "HP:0002817", name: "Abnormality of the upper limb" },
      { id: "HP:0040064", name: "Abnormality of limbs" },
      { id: "HP:0000118", name: "Phenotypic abnormality" },
      { id: "HP:0000001", name: "All" },
      { id: "HP:0011297", name: "Abnormal digit morphology" },
      { id: "HP:0002813", name: "Abnormal limb bone morphology" },
      { id: "HP:0011844", name: "Abnormal appendicular skeleton morphology" },
      { id: "HP:0011842", name: "Abnormal skeletal morphology" },
      { id: "HP:0000924", name: "Abnormality of the skeletal system" },
      { id: "HP:0033127", name: "Abnormality of the musculoskeletal system" },
      { id: "HP:0040068", name: "Abnormality of limb bone" },
      { id: "HP:0100807", name: "Long fingers" }
    ], paging: { page: 1, total_pages: 1, total_items: 15 }};
    service.ancestors(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
      done();
    });
    const req = httpTestingController.expectOne(`https://www.ebi.ac.uk/ols4/api/v2/ontologies/hp/classes/http://purl.obolibrary.org/obo/HP_0001166?includeObsoleteEntities=false`);
    expect(req.request.method).toEqual('GET');
    req.flush(testOLSResponseTerm);
  });

  it('should get the fake term descendants', (done) => {
      const id = "HP:0100807";
    const fakeResponse: CollectionResponse<OntologyTerm> = { data: [{ id: 'HP:0001182', name: "Tapered finger"}, { id: 'HP:0001166', name: "Arachnodactyly"}], paging: { page: 0, total_pages: 1, total_items: 2 }};
    service.descendants(id).subscribe(term => {
      expect(term).toEqual(fakeResponse);
      done();
    });
    const req = httpTestingController.expectOne(`https://www.ebi.ac.uk/ols4/api/v2/ontologies/hp/classes/http://purl.obolibrary.org/obo/HP_0100807/hierarchicalChildren?includeObsoleteEntities=false&size=100&lang=en`);
    expect(req.request.method).toEqual('GET');
    req.flush(testOLSResponseChildren);
  });
});


const testOLSResponseSearch: OLSResponse = 
{
  "page" : 0,
  "numElements" : 10,
  "totalPages" : 391,
  "totalElements" : 3907,
  "elements" : [ {
    "appearsIn" : [ "cpont", "scdo", "upheno", "hp" ],
    "curie" : "HP:0000873",
    "definedBy" : [ "hp" ],
    "definition" : [ {
      "type" : [ "reification" ],
      "value" : "A state of excessive water intake and hypotonic (dilute) polyuria. Diabetes insipidus may be due to failure of vasopressin (AVP) release (central or neurogenic diabetes insipidus) or to a failure of the kidney to respond to AVP (nephrogenic diabetes insipidus).",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
      } ]
    } ],
    "definitionProperty" : "http://purl.obolibrary.org/obo/IAO_0000115",
    "directAncestor" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001" ],
    "directParent" : [ "http://purl.obolibrary.org/obo/HP_0000818" ],
    "hasDirectChildren" : true,
    "hasDirectParents" : true,
    "hasHierarchicalChildren" : true,
    "hasHierarchicalParents" : true,
    "hierarchicalAncestor" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001" ],
    "hierarchicalParent" : [ "http://purl.obolibrary.org/obo/HP_0000818" ],
    "hierarchicalProperty" : "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    "imported" : false,
    "iri" : "http://purl.obolibrary.org/obo/HP_0000873",
    "isDefiningOntology" : true,
    "isObsolete" : false,
    "isPreferredRoot" : false,
    "label" : [ "Diabetes insipidus" ],
    "linkedEntities" : {
      "UMLS:C0011848" : {
        "url" : "https://uts.nlm.nih.gov/uts/umls/concept/C0011848",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "UMLS:C0011848"
      },
      "http://purl.obolibrary.org/obo/HP_0000118" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 23.0,
        "hasLocalDefinition" : true,
        "label" : [ "Phenotypic abnormality" ],
        "curie" : "HP:0000118",
        "type" : [ "class", "entity" ]
      },
      "https://w3id.org/babelon/comment" : {
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "comment" ],
        "curie" : "comment",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/translation_language" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_language" ],
        "curie" : "translation_language",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.geneontology.org/formats/oboInOwl#id" : {
        "definedBy" : [ "ohmi", "pato", "ecto" ],
        "numAppearsIn" : 177.0,
        "hasLocalDefinition" : true,
        "label" : [ "id" ],
        "curie" : "id",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/translator" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "translator" ],
        "curie" : "translator",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/source_value" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "source_value" ],
        "curie" : "source_value",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.w3.org/2000/01/rdf-schema#subClassOf" : {
        "definedBy" : [ "rdfs" ],
        "numAppearsIn" : 8.0,
        "hasLocalDefinition" : false,
        "label" : [ "subClassOf" ],
        "curie" : "RDFS:subClassOf",
        "type" : [ "property", "entity" ]
      },
      "http://purl.obolibrary.org/obo/IAO_0000115" : {
        "definedBy" : [ "ido", "omo", "pato", "ogms", "ro", "iao" ],
        "numAppearsIn" : 225.0,
        "hasLocalDefinition" : true,
        "label" : [ "definition" ],
        "curie" : "IAO:0000115",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://orcid.org/0000-0002-0736-9199" : {
        "source" : "ORCID",
        "url" : "https://orcid.org/0000-0002-0736-9199",
        "label" : "Robinson, Peter"
      },
      "https://w3id.org/babelon/translation_precision" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_precision" ],
        "curie" : "translation_precision",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/source_version" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "source_version" ],
        "curie" : "source_version",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/translation_confidence" : {
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_confidence" ],
        "curie" : "translation_confidence",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://purl.obolibrary.org/obo/HP_0000001" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 7.0,
        "hasLocalDefinition" : true,
        "label" : [ "All" ],
        "curie" : "HP:0000001",
        "type" : [ "class", "entity" ]
      },
      "https://w3id.org/babelon/translation_status" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_status" ],
        "curie" : "translation_status",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://purl.obolibrary.org/obo/HP_0000818" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 13.0,
        "hasLocalDefinition" : true,
        "label" : [ "Abnormality of the endocrine system" ],
        "curie" : "HP:0000818",
        "type" : [ "class", "entity" ]
      },
      "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : {
        "definedBy" : [ "ohmi", "omo", "pato", "ro", "oio", "ecto" ],
        "numAppearsIn" : 204.0,
        "hasLocalDefinition" : true,
        "label" : [ "database_cross_reference" ],
        "curie" : "hasDbXref",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "SNOMEDCT_US:15771004" : {
        "url" : "http://snomed.info/id/15771004",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "SNOMEDCT_US:15771004"
      },
      "https://w3id.org/babelon/translator_expertise" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "translator_expertise" ],
        "curie" : "translator_expertise",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/source_language" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "source_language" ],
        "curie" : "source_language",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.w3.org/2000/01/rdf-schema#label" : {
        "definedBy" : [ "rdfs" ],
        "numAppearsIn" : 198.0,
        "hasLocalDefinition" : true,
        "label" : [ "label" ],
        "curie" : "RDFS:label",
        "type" : [ "property", "entity" ]
      },
      "https://w3id.org/babelon/source" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "source" ],
        "curie" : "source",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "HP:0000873" : {
        "iri" : "http://purl.obolibrary.org/obo/HP_0000873",
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 4.0,
        "hasLocalDefinition" : true,
        "label" : [ "Diabetes insipidus" ],
        "curie" : "HP:0000873",
        "type" : [ "class", "entity" ],
        "url" : "http://purl.obolibrary.org/obo/HP_0000873",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json"
      },
      "https://w3id.org/babelon/translation_date" : {
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_date" ],
        "curie" : "translation_date",
        "type" : [ "property", "annotationProperty", "entity" ]
      }
    },
    "linksTo" : [ "http://purl.obolibrary.org/obo/HP_0000818", "https://w3id.org/babelon/translation_precision", "http://www.geneontology.org/formats/oboInOwl#hasDbXref", "https://w3id.org/babelon/source_language", "http://purl.obolibrary.org/obo/HP_0000118", "https://w3id.org/babelon/comment", "https://w3id.org/babelon/source_version", "https://w3id.org/babelon/translation_confidence", "https://w3id.org/babelon/translation_language", "http://www.geneontology.org/formats/oboInOwl#id", "http://purl.obolibrary.org/obo/HP_0000001", "https://w3id.org/babelon/translator", "http://purl.obolibrary.org/obo/HP_0000873", "https://w3id.org/babelon/source_value", "http://www.w3.org/2000/01/rdf-schema#subClassOf", "https://w3id.org/babelon/translator_expertise", "http://www.w3.org/2000/01/rdf-schema#label", "https://w3id.org/babelon/source", "http://purl.obolibrary.org/obo/IAO_0000115", "https://w3id.org/babelon/translation_status", "https://w3id.org/babelon/translation_date" ],
    "numDescendants" : 2.0,
    "numHierarchicalDescendants" : 2.0,
    "ontologyId" : "hp",
    "ontologyIri" : "http://purl.obolibrary.org/obo/hp/hp-international.owl",
    "ontologyPreferredPrefix" : "HP",
    "searchableAnnotationValues" : [ false ],
    "shortForm" : "HP_0000873",
    "type" : [ "class", "entity" ],
    "http://purl.obolibrary.org/obo/IAO_0000115" : [ {
      "type" : [ "reification" ],
      "value" : "A state of excessive water intake and hypotonic (dilute) polyuria. Diabetes insipidus may be due to failure of vasopressin (AVP) release (central or neurogenic diabetes insipidus) or to a failure of the kidney to respond to AVP (nephrogenic diabetes insipidus).",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
      } ]
    } ],
    "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : [ "SNOMEDCT_US:15771004", "UMLS:C0011848" ],
    "http://www.geneontology.org/formats/oboInOwl#id" : "HP:0000873",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
    "http://www.w3.org/2000/01/rdf-schema#label" : [ "Diabetes insipidus" ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf" : "http://purl.obolibrary.org/obo/HP_0000818"
  }, {
    "appearsIn" : [ "pride", "cpont", "maxo", "genepio", "scdo", "efo", "mondo", "upheno", "hp", "cido" ],
    "curie" : "HP:0000819",
    "definedBy" : [ "hp" ],
    "definition" : [ {
      "type" : [ "reification" ],
      "value" : "A group of abnormalities characterized by hyperglycemia and glucose intolerance.",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
      } ]
    } ],
    "definitionProperty" : "http://purl.obolibrary.org/obo/IAO_0000115",
    "directAncestor" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0001952", "http://purl.obolibrary.org/obo/HP_0011014", "http://purl.obolibrary.org/obo/HP_0012337", "http://purl.obolibrary.org/obo/HP_0001939" ],
    "directParent" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0001952" ],
    "hasDirectChildren" : true,
    "hasDirectParents" : true,
    "hasHierarchicalChildren" : true,
    "hasHierarchicalParents" : true,
    "hierarchicalAncestor" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0001952", "http://purl.obolibrary.org/obo/HP_0011014", "http://purl.obolibrary.org/obo/HP_0012337", "http://purl.obolibrary.org/obo/HP_0001939" ],
    "hierarchicalParent" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0001952" ],
    "hierarchicalProperty" : "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    "imported" : false,
    "iri" : "http://purl.obolibrary.org/obo/HP_0000819",
    "isDefiningOntology" : true,
    "isObsolete" : false,
    "isPreferredRoot" : false,
    "label" : [ "Diabetes mellitus" ],
    "linkedEntities" : {
      "http://purl.obolibrary.org/obo/HP_0011014" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 12.0,
        "hasLocalDefinition" : true,
        "label" : [ "Abnormal glucose homeostasis" ],
        "curie" : "HP:0011014",
        "type" : [ "class", "entity" ]
      },
      "UMLS:C0011849" : {
        "url" : "https://uts.nlm.nih.gov/uts/umls/concept/C0011849",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "UMLS:C0011849"
      },
      "https://w3id.org/babelon/comment" : {
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "comment" ],
        "curie" : "comment",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://purl.obolibrary.org/obo/HP_0000118" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 23.0,
        "hasLocalDefinition" : true,
        "label" : [ "Phenotypic abnormality" ],
        "curie" : "HP:0000118",
        "type" : [ "class", "entity" ]
      },
      "https://w3id.org/babelon/translation_language" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_language" ],
        "curie" : "translation_language",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "HP:0008260" : {
        "url" : "http://purl.obolibrary.org/obo/HP_0008260",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "HP:0008260"
      },
      "https://w3id.org/babelon/translator" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "translator" ],
        "curie" : "translator",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/source_value" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "source_value" ],
        "curie" : "source_value",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://purl.obolibrary.org/obo/IAO_0000115" : {
        "definedBy" : [ "ido", "omo", "pato", "ogms", "ro", "iao" ],
        "numAppearsIn" : 225.0,
        "hasLocalDefinition" : true,
        "label" : [ "definition" ],
        "curie" : "IAO:0000115",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://orcid.org/0000-0002-0736-9199" : {
        "source" : "ORCID",
        "url" : "https://orcid.org/0000-0002-0736-9199",
        "label" : "Robinson, Peter"
      },
      "http://purl.obolibrary.org/obo/HP_0012337" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 11.0,
        "hasLocalDefinition" : true,
        "label" : [ "Abnormal homeostasis" ],
        "curie" : "HP:0012337",
        "type" : [ "class", "entity" ]
      },
      "https://w3id.org/babelon/source_version" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "source_version" ],
        "curie" : "source_version",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/translation_confidence" : {
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_confidence" ],
        "curie" : "translation_confidence",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "HP:0000819" : {
        "iri" : "http://purl.obolibrary.org/obo/HP_0000819",
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 10.0,
        "hasLocalDefinition" : true,
        "label" : [ "Diabetes mellitus" ],
        "curie" : "HP:0000819",
        "type" : [ "class", "entity" ],
        "url" : "http://purl.obolibrary.org/obo/HP_0000819",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json"
      },
      "http://purl.obolibrary.org/obo/HP_0000001" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 7.0,
        "hasLocalDefinition" : true,
        "label" : [ "All" ],
        "curie" : "HP:0000001",
        "type" : [ "class", "entity" ]
      },
      "https://w3id.org/babelon/translation_status" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_status" ],
        "curie" : "translation_status",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://purl.obolibrary.org/obo/HP_0001952" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 10.0,
        "hasLocalDefinition" : true,
        "label" : [ "Glucose intolerance" ],
        "curie" : "HP:0001952",
        "type" : [ "class", "entity" ]
      },
      "HP:0008234" : {
        "url" : "http://purl.obolibrary.org/obo/HP_0008234",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "HP:0008234"
      },
      "http://www.w3.org/2000/01/rdf-schema#label" : {
        "definedBy" : [ "rdfs" ],
        "numAppearsIn" : 198.0,
        "hasLocalDefinition" : true,
        "label" : [ "label" ],
        "curie" : "RDFS:label",
        "type" : [ "property", "entity" ]
      },
      "https://w3id.org/babelon/source" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "source" ],
        "curie" : "source",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId" : {
        "definedBy" : [ "pato", "oio" ],
        "numAppearsIn" : 145.0,
        "hasLocalDefinition" : true,
        "label" : [ "has_alternative_id" ],
        "curie" : "OIO:hasAlternativeId",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/translation_date" : {
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_date" ],
        "curie" : "translation_date",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.geneontology.org/formats/oboInOwl#id" : {
        "definedBy" : [ "ohmi", "pato", "ecto" ],
        "numAppearsIn" : 177.0,
        "hasLocalDefinition" : true,
        "label" : [ "id" ],
        "curie" : "id",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.w3.org/2000/01/rdf-schema#subClassOf" : {
        "definedBy" : [ "rdfs" ],
        "numAppearsIn" : 8.0,
        "hasLocalDefinition" : false,
        "label" : [ "subClassOf" ],
        "curie" : "RDFS:subClassOf",
        "type" : [ "property", "entity" ]
      },
      "https://w3id.org/babelon/translation_precision" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "translation_precision" ],
        "curie" : "translation_precision",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://purl.obolibrary.org/obo/HP_0001939" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 15.0,
        "hasLocalDefinition" : true,
        "label" : [ "Abnormality of metabolism/homeostasis" ],
        "curie" : "HP:0001939",
        "type" : [ "class", "entity" ]
      },
      "HP:0008217" : {
        "url" : "http://purl.obolibrary.org/obo/HP_0008217",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "HP:0008217"
      },
      "http://purl.obolibrary.org/obo/HP_0000818" : {
        "definedBy" : [ "hp" ],
        "numAppearsIn" : 13.0,
        "hasLocalDefinition" : true,
        "label" : [ "Abnormality of the endocrine system" ],
        "curie" : "HP:0000818",
        "type" : [ "class", "entity" ]
      },
      "SNOMEDCT_US:73211009" : {
        "url" : "http://snomed.info/id/73211009",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "SNOMEDCT_US:73211009"
      },
      "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym" : {
        "definedBy" : [ "ohmi", "omo", "pato", "ro", "oio", "ecto" ],
        "numAppearsIn" : 205.0,
        "hasLocalDefinition" : true,
        "label" : [ "has_exact_synonym" ],
        "curie" : "hasExactSynonym",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : {
        "definedBy" : [ "ohmi", "omo", "pato", "ro", "oio", "ecto" ],
        "numAppearsIn" : 204.0,
        "hasLocalDefinition" : true,
        "label" : [ "database_cross_reference" ],
        "curie" : "hasDbXref",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "HP:0004908" : {
        "url" : "http://purl.obolibrary.org/obo/HP_0004908",
        "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
        "curie" : "HP:0004908"
      },
      "https://w3id.org/babelon/translator_expertise" : {
        "numAppearsIn" : 2.0,
        "hasLocalDefinition" : true,
        "label" : [ "translator_expertise" ],
        "curie" : "translator_expertise",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "https://w3id.org/babelon/source_language" : {
        "numAppearsIn" : 3.0,
        "hasLocalDefinition" : true,
        "label" : [ "source_language" ],
        "curie" : "source_language",
        "type" : [ "property", "annotationProperty", "entity" ]
      }
    },
    "linksTo" : [ "http://purl.obolibrary.org/obo/HP_0000819", "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0011014", "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym", "http://www.geneontology.org/formats/oboInOwl#hasDbXref", "https://w3id.org/babelon/comment", "http://purl.obolibrary.org/obo/HP_0000118", "https://w3id.org/babelon/translation_language", "http://www.geneontology.org/formats/oboInOwl#id", "https://w3id.org/babelon/translator", "https://w3id.org/babelon/source_value", "http://www.w3.org/2000/01/rdf-schema#subClassOf", "https://w3id.org/babelon/translator_expertise", "http://purl.obolibrary.org/obo/IAO_0000115", "https://w3id.org/babelon/translation_precision", "http://purl.obolibrary.org/obo/HP_0012337", "https://w3id.org/babelon/source_language", "https://w3id.org/babelon/source_version", "https://w3id.org/babelon/translation_confidence", "http://purl.obolibrary.org/obo/HP_0001939", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0001952", "http://www.w3.org/2000/01/rdf-schema#label", "https://w3id.org/babelon/source", "https://w3id.org/babelon/translation_status", "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId", "https://w3id.org/babelon/translation_date" ],
    "numDescendants" : 9.0,
    "numHierarchicalDescendants" : 9.0,
    "ontologyId" : "hp",
    "ontologyIri" : "http://purl.obolibrary.org/obo/hp/hp-international.owl",
    "ontologyPreferredPrefix" : "HP",
    "searchableAnnotationValues" : [ false ],
    "shortForm" : "HP_0000819",
    "synonymProperty" : "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
    "type" : [ "class", "entity" ],
    "http://purl.obolibrary.org/obo/IAO_0000115" : [ {
      "type" : [ "reification" ],
      "value" : "A group of abnormalities characterized by hyperglycemia and glucose intolerance.",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
      } ]
    } ],
    "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId" : [ "HP:0004908", "HP:0008217", "HP:0008234", "HP:0008260" ],
    "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : [ "SNOMEDCT_US:73211009", "UMLS:C0011849" ],
    "http://www.geneontology.org/formats/oboInOwl#id" : "HP:0000819",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
    "http://www.w3.org/2000/01/rdf-schema#label" : [ "Diabetes mellitus" ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf" : [ "http://purl.obolibrary.org/obo/HP_0000818", "http://purl.obolibrary.org/obo/HP_0001952" ]
  }, {
    "appearsIn" : [ "snomed" ],
    "curie" : "SNOMED:405096004",
    "definedBy" : [ "snomed" ],
    "directAncestor" : [ "http://snomed.info/id/406211006", "http://snomed.info/id/228272008", "http://snomed.info/id/363896009", "http://snomed.info/id/363870007", "http://snomed.info/id/363788007", "http://snomed.info/id/363787002", "http://snomed.info/id/138875005" ],
    "directParent" : [ "http://snomed.info/id/406211006" ],
    "hasDirectChildren" : false,
    "hasDirectParents" : true,
    "hasHierarchicalChildren" : false,
    "hasHierarchicalParents" : true,
    "hierarchicalAncestor" : [ "http://snomed.info/id/406211006", "http://snomed.info/id/228272008", "http://snomed.info/id/363896009", "http://snomed.info/id/363870007", "http://snomed.info/id/363788007", "http://snomed.info/id/363787002", "http://snomed.info/id/138875005" ],
    "hierarchicalParent" : [ "http://snomed.info/id/406211006" ],
    "hierarchicalProperty" : "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    "imported" : false,
    "iri" : "http://snomed.info/id/405096004",
    "isDefiningOntology" : true,
    "isObsolete" : false,
    "isPreferredRoot" : false,
    "label" : [ "Diabetes self-management behavior (observable entity)" ],
    "linkedEntities" : {
      "http://www.w3.org/2004/02/skos/core#altLabel" : {
        "definedBy" : [ "skos" ],
        "numAppearsIn" : 22.0,
        "hasLocalDefinition" : true,
        "label" : [ "alternative label" ],
        "curie" : "SKOS:altLabel",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://www.w3.org/2000/01/rdf-schema#subClassOf" : {
        "definedBy" : [ "rdfs" ],
        "numAppearsIn" : 8.0,
        "hasLocalDefinition" : false,
        "label" : [ "subClassOf" ],
        "curie" : "RDFS:subClassOf",
        "type" : [ "property", "entity" ]
      },
      "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : {
        "definedBy" : [ "ohmi", "omo", "pato", "ro", "oio", "ecto" ],
        "numAppearsIn" : 204.0,
        "hasLocalDefinition" : true,
        "label" : [ "database_cross_reference" ],
        "curie" : "hasDbXref",
        "type" : [ "property", "annotationProperty", "entity" ]
      },
      "http://snomed.info/id/363870007" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "Mental state, behavior / psychosocial function observable (observable entity)" ],
        "curie" : "SNOMED:363870007",
        "type" : [ "class", "entity" ]
      },
      "http://snomed.info/id/363788007" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "Clinical history/examination observable (observable entity)", "Clinical history/examination observable" ],
        "curie" : "SNOMED:363788007",
        "type" : [ "class", "entity" ]
      },
      "http://snomed.info/id/228272008" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "Health-related behavior (observable entity)" ],
        "curie" : "SNOMED:228272008",
        "type" : [ "class", "entity" ]
      },
      "http://snomed.info/id/406211006" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "Personal health management behavior (observable entity)" ],
        "curie" : "SNOMED:406211006",
        "type" : [ "class", "entity" ]
      },
      "http://snomed.info/id/363896009" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "Behavior observable (observable entity)" ],
        "curie" : "SNOMED:363896009",
        "type" : [ "class", "entity" ]
      },
      "http://www.w3.org/2000/01/rdf-schema#label" : {
        "definedBy" : [ "rdfs" ],
        "numAppearsIn" : 198.0,
        "hasLocalDefinition" : false,
        "label" : [ "label" ],
        "curie" : "RDFS:label",
        "type" : [ "property", "entity" ]
      },
      "http://snomed.info/id/138875005" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "SNOMED CT Concept (SNOMED RT+CTV3)", "SNOMED CT Concept" ],
        "curie" : "SNOMED:138875005",
        "type" : [ "class", "entity" ]
      },
      "http://snomed.info/id/363787002" : {
        "definedBy" : [ "snomed" ],
        "numAppearsIn" : 1.0,
        "hasLocalDefinition" : true,
        "label" : [ "Observable entity (observable entity)", "Observable entity" ],
        "curie" : "SNOMED:363787002",
        "type" : [ "class", "entity" ]
      },
      "http://www.w3.org/2004/02/skos/core#prefLabel" : {
        "definedBy" : [ "skos" ],
        "numAppearsIn" : 28.0,
        "hasLocalDefinition" : true,
        "label" : [ "preferred label" ],
        "curie" : "SKOS:prefLabel",
        "type" : [ "property", "annotationProperty", "entity" ]
      }
    },
    "linksTo" : [ "http://snomed.info/id/363870007", "http://snomed.info/id/363896009", "http://snomed.info/id/363788007", "http://www.w3.org/2004/02/skos/core#altLabel", "http://snomed.info/id/228272008", "http://www.w3.org/2000/01/rdf-schema#subClassOf", "http://www.geneontology.org/formats/oboInOwl#hasDbXref", "http://www.w3.org/2000/01/rdf-schema#label", "http://snomed.info/id/406211006", "http://snomed.info/id/138875005", "http://snomed.info/id/363787002", "http://www.w3.org/2004/02/skos/core#prefLabel" ],
    "numDescendants" : 0.0,
    "numHierarchicalDescendants" : 0.0,
    "ontologyId" : "snomed",
    "ontologyIri" : "http://snomed.info/sct/900000000000207008",
    "ontologyPreferredPrefix" : "SNOMED",
    "searchableAnnotationValues" : [ "Diabetes self-management", false ],
    "shortForm" : "SNOMED_405096004",
    "type" : [ "class", "entity" ],
    "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "CTV3:XUaE9",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
    "http://www.w3.org/2000/01/rdf-schema#label" : "Diabetes self-management behavior (observable entity)",
    "http://www.w3.org/2000/01/rdf-schema#subClassOf" : "http://snomed.info/id/406211006",
    "http://www.w3.org/2004/02/skos/core#altLabel" : "Diabetes self-management"
  },],
  "facetFieldsToCounts" : {
    "ontologyId" : {
      "ncit" : 979,
      "snomed" : 694,
      "mondo" : 240,
      "efo" : 212,
      "pride" : 212,
      "mesh" : 207,
      "ordo" : 130,
      "gexo" : 113,
      "reto" : 113,
      "rexo" : 113,
      "cco" : 112,
      "doid" : 89,
      "enm" : 49,
      "chebi" : 42,
      "slm" : 42,
      "oae" : 35,
      "pw" : 29,
      "upheno" : 25,
      "ogg" : 24,
      "dron" : 23,
      "mp" : 22,
      "pr" : 21,
      "bao" : 20,
      "hp" : 20,
      "txpo" : 19,
      "cmo" : 18,
      "cpont" : 17,
      "bcgo" : 16,
      "chiro" : 16,
      "maxo" : 16,
      "xco" : 15,
      "bcio" : 13,
      "scdo" : 13,
      "oba" : 11,
      "omit" : 11,
      "cl" : 10,
      "genepio" : 10,
      "opmi" : 10,
      "go" : 8,
      "ontoneo" : 8,
      "bmont" : 7,
      "hra" : 7,
      "micro" : 7,
      "vo" : 6,
      "clo" : 5,
      "pcl" : 5,
      "ado" : 4,
      "cido" : 4,
      "foodon" : 4,
      "bto" : 3,
      "ecto" : 3,
      "epio" : 3,
      "htn" : 3,
      "ico" : 3,
      "obib" : 3,
      "ohd" : 3,
      "one" : 3,
      "ons" : 3,
      "rs" : 3,
      "covoc" : 2,
      "hcao" : 2,
      "mpio" : 2,
      "ngbo" : 2,
      "obi" : 2,
      "rbo" : 2,
      "sepio" : 2,
      "vt" : 2,
      "addicto" : 1,
      "agro" : 1,
      "aism" : 1,
      "apollo_sv" : 1,
      "cdno" : 1,
      "cheminf" : 1,
      "dhba" : 1,
      "dideo" : 1,
      "duo" : 1,
      "ecao" : 1,
      "ecocore" : 1,
      "flopo" : 1,
      "fovt" : 1,
      "fypo" : 1,
      "hba" : 1,
      "iao" : 1,
      "labo" : 1,
      "mcro" : 1,
      "mfmo" : 1,
      "ohpi" : 1,
      "omiabis" : 1,
      "omrse" : 1,
      "oostt" : 1,
      "pato" : 1,
      "pdro" : 1,
      "peco" : 1,
      "phipo" : 1,
      "psdo" : 1,
      "ro" : 1,
      "srao" : 1,
      "to" : 1,
      "uberon" : 1,
      "wbphenotype" : 1
    },
    "type" : {
      "entity" : 3907,
      "class" : 3905,
      "objectproperty" : 2,
      "property" : 2,
      "annotationproperty" : 0,
      "dataproperty" : 0,
      "individual" : 0,
      "ontology" : 0
    }
  }
};

const testOLSTransformedSearch: CollectionResponse<OntologyTerm> = {
  "data": [{"id": "HP:0000873", "name": "Diabetes insipidus"}, {"id": "HP:0000819", "name": "Diabetes mellitus"}],
  "paging": {"page": 0, "total_items": 3907, "total_pages": 391}
};

const testOLSResponseTerm = {
  "appearsIn" : [ "upheno", "hp" ],
  "curie" : "HP:0001166",
  "definedBy" : [ "hp" ],
  "definition" : [ {
    "type" : [ "reification" ],
    "value" : "Abnormally long and slender fingers (spider fingers).",
    "axioms" : [ {
      "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
    } ]
  } ],
  "definitionProperty" : "http://purl.obolibrary.org/obo/IAO_0000115",
  "directAncestor" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0001167", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0011297", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0011844", "http://purl.obolibrary.org/obo/HP_0011842", "http://purl.obolibrary.org/obo/HP_0000924", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0040068", "http://purl.obolibrary.org/obo/HP_0100807" ],
  "directParent" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0100807" ],
  "hasDirectChildren" : false,
  "hasDirectParents" : true,
  "hasHierarchicalChildren" : false,
  "hasHierarchicalParents" : true,
  "hierarchicalAncestor" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0001167", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0011297", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0011844", "http://purl.obolibrary.org/obo/HP_0011842", "http://purl.obolibrary.org/obo/HP_0000924", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0040068", "http://purl.obolibrary.org/obo/HP_0100807" ],
  "hierarchicalParent" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0100807" ],
  "hierarchicalProperty" : "http://www.w3.org/2000/01/rdf-schema#subClassOf",
  "imported" : false,
  "iri" : "http://purl.obolibrary.org/obo/HP_0001166",
  "isDefiningOntology" : true,
  "isObsolete" : false,
  "isPreferredRoot" : false,
  "label" : [ "Arachnodactyly" ],
  "linkedEntities" : {
    "http://purl.obolibrary.org/obo/HP_0000118" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 23.0,
      "hasLocalDefinition" : true,
      "label" : [ "Phenotypic abnormality" ],
      "curie" : "HP:0000118",
      "type" : [ "class", "entity" ]
    },
    "https://w3id.org/babelon/comment" : {
      "numAppearsIn" : 1.0,
      "hasLocalDefinition" : true,
      "label" : [ "comment" ],
      "curie" : "comment",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0002813" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 8.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormal limb bone morphology" ],
      "curie" : "HP:0002813",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0002817" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 8.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormality of the upper limb" ],
      "curie" : "HP:0002817",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0001167" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 7.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormal finger morphology" ],
      "curie" : "HP:0001167",
      "type" : [ "class", "entity" ]
    },
    "https://w3id.org/babelon/translation_language" : {
      "numAppearsIn" : 3.0,
      "hasLocalDefinition" : true,
      "label" : [ "translation_language" ],
      "curie" : "translation_language",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "https://w3id.org/babelon/translator" : {
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "translator" ],
      "curie" : "translator",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "https://w3id.org/babelon/source_value" : {
      "numAppearsIn" : 3.0,
      "hasLocalDefinition" : true,
      "label" : [ "source_value" ],
      "curie" : "source_value",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "UMLS:C0003706" : {
      "url" : "https://uts.nlm.nih.gov/uts/umls/concept/C0003706",
      "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
      "curie" : "UMLS:C0003706"
    },
    "http://purl.obolibrary.org/obo/HP_0100807" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 7.0,
      "hasLocalDefinition" : true,
      "label" : [ "Long fingers" ],
      "curie" : "HP:0100807",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/IAO_0000115" : {
      "definedBy" : [ "ido", "omo", "pato", "ogms", "ro", "iao" ],
      "numAppearsIn" : 225.0,
      "hasLocalDefinition" : true,
      "label" : [ "definition" ],
      "curie" : "IAO:0000115",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "https://orcid.org/0000-0002-0736-9199" : {
      "source" : "ORCID",
      "url" : "https://orcid.org/0000-0002-0736-9199",
      "label" : "Robinson, Peter"
    },
    "https://w3id.org/babelon/source_version" : {
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "source_version" ],
      "curie" : "source_version",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0000924" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 13.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormality of the skeletal system" ],
      "curie" : "HP:0000924",
      "type" : [ "class", "entity" ]
    },
    "https://w3id.org/babelon/translation_confidence" : {
      "numAppearsIn" : 1.0,
      "hasLocalDefinition" : true,
      "label" : [ "translation_confidence" ],
      "curie" : "translation_confidence",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0000001" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 7.0,
      "hasLocalDefinition" : true,
      "label" : [ "All" ],
      "curie" : "HP:0000001",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/hp#layperson" : {
      "numAppearsIn" : 4.0,
      "hasLocalDefinition" : true,
      "label" : [ "layperson term" ],
      "curie" : "layperson",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "HP:0001505" : {
      "url" : "http://purl.obolibrary.org/obo/HP_0001505",
      "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
      "curie" : "HP:0001505"
    },
    "https://w3id.org/babelon/translation_status" : {
      "numAppearsIn" : 3.0,
      "hasLocalDefinition" : true,
      "label" : [ "translation_status" ],
      "curie" : "translation_status",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "HP:0001166" : {
      "iri" : "http://purl.obolibrary.org/obo/HP_0001166",
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "Arachnodactyly" ],
      "curie" : "HP:0001166",
      "type" : [ "class", "entity" ],
      "url" : "http://purl.obolibrary.org/obo/HP_0001166",
      "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json"
    },
    "http://purl.obolibrary.org/obo/HP_0001155" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 6.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormality of the hand" ],
      "curie" : "HP:0001155",
      "type" : [ "class", "entity" ]
    },
    "http://www.w3.org/2000/01/rdf-schema#label" : {
      "definedBy" : [ "rdfs" ],
      "numAppearsIn" : 198.0,
      "hasLocalDefinition" : true,
      "label" : [ "label" ],
      "curie" : "RDFS:label",
      "type" : [ "property", "entity" ]
    },
    "https://w3id.org/babelon/source" : {
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "source" ],
      "curie" : "source",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId" : {
      "definedBy" : [ "pato", "oio" ],
      "numAppearsIn" : 145.0,
      "hasLocalDefinition" : true,
      "label" : [ "has_alternative_id" ],
      "curie" : "OIO:hasAlternativeId",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "https://w3id.org/babelon/translation_date" : {
      "numAppearsIn" : 1.0,
      "hasLocalDefinition" : true,
      "label" : [ "translation_date" ],
      "curie" : "translation_date",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0011297" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 9.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormal digit morphology" ],
      "curie" : "HP:0011297",
      "type" : [ "class", "entity" ]
    },
    "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : {
      "definedBy" : [ "oio" ],
      "numAppearsIn" : 93.0,
      "hasLocalDefinition" : true,
      "label" : [ "has_synonym_type" ],
      "curie" : "OIO:hasSynonymType",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0033127" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 11.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormality of the musculoskeletal system" ],
      "curie" : "HP:0033127",
      "type" : [ "class", "entity" ]
    },
    "http://www.geneontology.org/formats/oboInOwl#id" : {
      "definedBy" : [ "ohmi", "pato", "ecto" ],
      "numAppearsIn" : 177.0,
      "hasLocalDefinition" : true,
      "label" : [ "id" ],
      "curie" : "id",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://www.w3.org/2000/01/rdf-schema#subClassOf" : {
      "definedBy" : [ "rdfs" ],
      "numAppearsIn" : 8.0,
      "hasLocalDefinition" : false,
      "label" : [ "subClassOf" ],
      "curie" : "RDFS:subClassOf",
      "type" : [ "property", "entity" ]
    },
    "https://w3id.org/babelon/translation_precision" : {
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "translation_precision" ],
      "curie" : "translation_precision",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0011842" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 12.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormal skeletal morphology" ],
      "curie" : "HP:0011842",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0040064" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 10.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormality of limbs" ],
      "curie" : "HP:0040064",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0011844" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 8.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormal appendicular skeleton morphology" ],
      "curie" : "HP:0011844",
      "type" : [ "class", "entity" ]
    },
    "http://purl.obolibrary.org/obo/HP_0040068" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 8.0,
      "hasLocalDefinition" : true,
      "label" : [ "Abnormality of limb bone" ],
      "curie" : "HP:0040068",
      "type" : [ "class", "entity" ]
    },
    "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym" : {
      "definedBy" : [ "ohmi", "omo", "pato", "ro", "oio", "ecto" ],
      "numAppearsIn" : 205.0,
      "hasLocalDefinition" : true,
      "label" : [ "has_exact_synonym" ],
      "curie" : "hasExactSynonym",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : {
      "definedBy" : [ "ohmi", "omo", "pato", "ro", "oio", "ecto" ],
      "numAppearsIn" : 204.0,
      "hasLocalDefinition" : true,
      "label" : [ "database_cross_reference" ],
      "curie" : "hasDbXref",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "https://w3id.org/babelon/translator_expertise" : {
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "translator_expertise" ],
      "curie" : "translator_expertise",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "https://w3id.org/babelon/source_language" : {
      "numAppearsIn" : 3.0,
      "hasLocalDefinition" : true,
      "label" : [ "source_language" ],
      "curie" : "source_language",
      "type" : [ "property", "annotationProperty", "entity" ]
    },
    "SNOMEDCT_US:62250003" : {
      "url" : "http://snomed.info/id/62250003",
      "source" : "https://raw.githubusercontent.com/biopragmatics/bioregistry/main/exports/registry/registry.json",
      "curie" : "SNOMEDCT_US:62250003"
    },
    "http://purl.obolibrary.org/obo/HP_0001238" : {
      "definedBy" : [ "hp" ],
      "numAppearsIn" : 2.0,
      "hasLocalDefinition" : true,
      "label" : [ "Slender finger" ],
      "curie" : "HP:0001238",
      "type" : [ "class", "entity" ]
    }
  },
  "linksTo" : [ "http://purl.obolibrary.org/obo/HP_0011297", "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym", "http://www.geneontology.org/formats/oboInOwl#hasSynonymType", "http://www.geneontology.org/formats/oboInOwl#hasDbXref", "http://purl.obolibrary.org/obo/HP_0000118", "https://w3id.org/babelon/comment", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0001167", "https://w3id.org/babelon/translation_language", "http://www.geneontology.org/formats/oboInOwl#id", "http://purl.obolibrary.org/obo/HP_0001166", "https://w3id.org/babelon/translator", "https://w3id.org/babelon/source_value", "http://www.w3.org/2000/01/rdf-schema#subClassOf", "https://w3id.org/babelon/translator_expertise", "http://purl.obolibrary.org/obo/HP_0100807", "http://purl.obolibrary.org/obo/IAO_0000115", "https://w3id.org/babelon/translation_precision", "http://purl.obolibrary.org/obo/HP_0011842", "https://w3id.org/babelon/source_language", "https://w3id.org/babelon/source_version", "http://purl.obolibrary.org/obo/HP_0000924", "https://w3id.org/babelon/translation_confidence", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/hp#layperson", "http://www.w3.org/2000/01/rdf-schema#label", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0011844", "https://w3id.org/babelon/source", "https://w3id.org/babelon/translation_status", "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId", "http://purl.obolibrary.org/obo/HP_0040068", "https://w3id.org/babelon/translation_date" ],
  "numDescendants" : 0.0,
  "numHierarchicalDescendants" : 0.0,
  "ontologyId" : "hp",
  "ontologyIri" : "http://purl.obolibrary.org/obo/hp/hp-international.owl",
  "ontologyPreferredPrefix" : "HP",
  "searchableAnnotationValues" : [ false ],
  "shortForm" : "HP_0001166",
  "synonym" : [ {
    "type" : [ "reification" ],
    "value" : "Long slender fingers",
    "axioms" : [ {
      "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
      "oboSynonymTypeName" : "layperson term"
    } ]
  }, "Long, slender fingers", {
    "type" : [ "reification" ],
    "value" : "Spider fingers",
    "axioms" : [ {
      "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
      "oboSynonymTypeName" : "layperson term"
    } ]
  } ],
  "synonymProperty" : "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
  "type" : [ "class", "entity" ],
  "http://purl.obolibrary.org/obo/IAO_0000115" : [ {
    "type" : [ "reification" ],
    "value" : "Abnormally long and slender fingers (spider fingers).",
    "axioms" : [ {
      "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
    } ]
  } ],
  "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId" : "HP:0001505",
  "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : [ "SNOMEDCT_US:62250003", "UMLS:C0003706" ],
  "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym" : [ {
    "type" : [ "reification" ],
    "value" : "Long slender fingers",
    "axioms" : [ {
      "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
      "oboSynonymTypeName" : "layperson term"
    } ]
  }, "Long, slender fingers", {
    "type" : [ "reification" ],
    "value" : "Spider fingers",
    "axioms" : [ {
      "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
      "oboSynonymTypeName" : "layperson term"
    } ]
  } ],
  "http://www.geneontology.org/formats/oboInOwl#id" : "HP:0001166",
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
  "http://www.w3.org/2000/01/rdf-schema#label" : [ "Arachnodactyly" ],
  "http://www.w3.org/2000/01/rdf-schema#subClassOf" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0100807" ]
}

const testOLSResponseChildren = {
  "page" : 0,
  "numElements" : 2,
  "totalPages" : 1,
  "totalElements" : 2,
  "elements" : [ {
    "appearsIn" : [ "pride", "cpont", "efo", "upheno", "hp", "oba" ],
    "curie" : "HP:0001182",
    "definedBy" : [ "hp" ],
    "definition" : [ {
      "type" : [ "reification" ],
      "value" : "The gradual reduction in girth of the finger from proximal to distal.",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "PMID:19125433"
      } ]
    } ],
    "definitionProperty" : "http://purl.obolibrary.org/obo/IAO_0000115",
    "directAncestor" : [ "http://purl.obolibrary.org/obo/HP_0100807", "http://purl.obolibrary.org/obo/HP_0001167", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0011297", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0011844", "http://purl.obolibrary.org/obo/HP_0011842", "http://purl.obolibrary.org/obo/HP_0000924", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0040068" ],
    "directParent" : [ "http://purl.obolibrary.org/obo/HP_0100807" ],
    "hasDirectChildren" : false,
    "hasDirectParents" : true,
    "hasHierarchicalChildren" : false,
    "hasHierarchicalParents" : true,
    "hierarchicalAncestor" : [ "http://purl.obolibrary.org/obo/HP_0100807", "http://purl.obolibrary.org/obo/HP_0001167", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0011297", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0011844", "http://purl.obolibrary.org/obo/HP_0011842", "http://purl.obolibrary.org/obo/HP_0000924", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0040068" ],
    "hierarchicalParent" : [ "http://purl.obolibrary.org/obo/HP_0100807" ],
    "hierarchicalProperty" : "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    "imported" : false,
    "iri" : "http://purl.obolibrary.org/obo/HP_0001182",
    "isDefiningOntology" : true,
    "isObsolete" : false,
    "isPreferredRoot" : false,
    "label" : [ "Tapered finger" ],
    "linkedEntities" : {},
    "linksTo" : [ "http://purl.obolibrary.org/obo/HP_0011297", "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym", "http://www.geneontology.org/formats/oboInOwl#hasSynonymType", "http://www.geneontology.org/formats/oboInOwl#hasDbXref", "http://purl.obolibrary.org/obo/HP_0000118", "https://w3id.org/babelon/comment", "http://purl.obolibrary.org/obo/RO_0000052", "http://purl.obolibrary.org/obo/RO_0002573", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/hp#hposlim_core", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0001167", "https://w3id.org/babelon/translation_language", "http://www.geneontology.org/formats/oboInOwl#id", "http://purl.obolibrary.org/obo/PATO_0000460", "https://w3id.org/babelon/translator", "https://w3id.org/babelon/source_value", "http://www.w3.org/2000/01/rdf-schema#subClassOf", "http://www.geneontology.org/formats/oboInOwl#inSubset", "https://w3id.org/babelon/translator_expertise", "http://purl.obolibrary.org/obo/HP_0001182", "http://purl.obolibrary.org/obo/HP_0100807", "http://purl.obolibrary.org/obo/UBERON_0002389", "http://purl.obolibrary.org/obo/IAO_0000115", "http://purl.obolibrary.org/obo/BFO_0000051", "https://w3id.org/babelon/translation_precision", "http://purl.obolibrary.org/obo/HP_0011842", "https://w3id.org/babelon/source_language", "http://purl.obolibrary.org/obo/PATO_0001500", "https://w3id.org/babelon/source_version", "http://purl.obolibrary.org/obo/HP_0000924", "https://w3id.org/babelon/translation_confidence", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/hp#layperson", "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym", "http://www.w3.org/2000/01/rdf-schema#label", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0011844", "https://w3id.org/babelon/source", "https://w3id.org/babelon/translation_status", "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId", "http://purl.obolibrary.org/obo/HP_0040068", "https://w3id.org/babelon/translation_date" ],
    "numDescendants" : 0.0,
    "numHierarchicalDescendants" : 0.0,
    "ontologyId" : "hp",
    "ontologyIri" : "http://purl.obolibrary.org/obo/hp/hp-international.owl",
    "ontologyPreferredPrefix" : "HP",
    "searchableAnnotationValues" : [ false ],
    "shortForm" : "HP_0001182",
    "synonym" : [ "Distally tapering fingers", {
      "type" : [ "reification" ],
      "value" : "Tapered finger",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, {
      "type" : [ "reification" ],
      "value" : "Tapered fingertips",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, {
      "type" : [ "reification" ],
      "value" : "Tapering fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, {
      "type" : [ "reification" ],
      "value" : "Tapered fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-5316-1399"
      } ]
    } ],
    "synonymProperty" : [ "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym", "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym" ],
    "type" : [ "class", "entity" ],
    "http://purl.obolibrary.org/obo/IAO_0000115" : [ {
      "type" : [ "reification" ],
      "value" : "The gradual reduction in girth of the finger from proximal to distal.",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "PMID:19125433"
      } ]
    } ],
    "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId" : [ "HP:0005795", "HP:0005800", "HP:0006032", "HP:0006080", "HP:0006098", "HP:0006111", "HP:0006125", "HP:0006244", "HP:0007532" ],
    "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : [ "SNOMEDCT_US:249768009", "UMLS:C0426886" ],
    "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym" : [ "Distally tapering fingers", {
      "type" : [ "reification" ],
      "value" : "Tapered finger",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, {
      "type" : [ "reification" ],
      "value" : "Tapered fingertips",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, {
      "type" : [ "reification" ],
      "value" : "Tapering fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    } ],
    "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym" : {
      "type" : [ "reification" ],
      "value" : "Tapered fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-5316-1399"
      } ]
    },
    "http://www.geneontology.org/formats/oboInOwl#id" : "HP:0001182",
    "http://www.geneontology.org/formats/oboInOwl#inSubset" : "http://purl.obolibrary.org/obo/hp#hposlim_core",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
    "http://www.w3.org/2000/01/rdf-schema#label" : [ "Tapered finger" ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf" : "http://purl.obolibrary.org/obo/HP_0100807",
    "http://www.w3.org/2002/07/owl#equivalentClass" : {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Restriction",
      "http://www.w3.org/2002/07/owl#onProperty" : "http://purl.obolibrary.org/obo/BFO_0000051",
      "http://www.w3.org/2002/07/owl#someValuesFrom" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
        "http://www.w3.org/2002/07/owl#intersectionOf" : [ "http://purl.obolibrary.org/obo/PATO_0001500", {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Restriction",
          "http://www.w3.org/2002/07/owl#onProperty" : "http://purl.obolibrary.org/obo/RO_0000052",
          "http://www.w3.org/2002/07/owl#someValuesFrom" : "http://purl.obolibrary.org/obo/UBERON_0002389",
          "isObsolete" : false
        }, {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Restriction",
          "http://www.w3.org/2002/07/owl#onProperty" : "http://purl.obolibrary.org/obo/RO_0002573",
          "http://www.w3.org/2002/07/owl#someValuesFrom" : "http://purl.obolibrary.org/obo/PATO_0000460",
          "isObsolete" : false
        } ]
      },
      "isObsolete" : false
    }
  }, {
    "appearsIn" : [ "upheno", "hp" ],
    "curie" : "HP:0001166",
    "definedBy" : [ "hp" ],
    "definition" : [ {
      "type" : [ "reification" ],
      "value" : "Abnormally long and slender fingers (spider fingers).",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
      } ]
    } ],
    "definitionProperty" : "http://purl.obolibrary.org/obo/IAO_0000115",
    "directAncestor" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0001167", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0011297", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0011844", "http://purl.obolibrary.org/obo/HP_0011842", "http://purl.obolibrary.org/obo/HP_0000924", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0040068", "http://purl.obolibrary.org/obo/HP_0100807" ],
    "directParent" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0100807" ],
    "hasDirectChildren" : false,
    "hasDirectParents" : true,
    "hasHierarchicalChildren" : false,
    "hasHierarchicalParents" : true,
    "hierarchicalAncestor" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0001167", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0000118", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0011297", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0011844", "http://purl.obolibrary.org/obo/HP_0011842", "http://purl.obolibrary.org/obo/HP_0000924", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0040068", "http://purl.obolibrary.org/obo/HP_0100807" ],
    "hierarchicalParent" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0100807" ],
    "hierarchicalProperty" : "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    "imported" : false,
    "iri" : "http://purl.obolibrary.org/obo/HP_0001166",
    "isDefiningOntology" : true,
    "isObsolete" : false,
    "isPreferredRoot" : false,
    "label" : [ "Arachnodactyly" ],
    "linkedEntities" : {},
    "linksTo" : [ "http://purl.obolibrary.org/obo/HP_0011297", "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym", "http://www.geneontology.org/formats/oboInOwl#hasSynonymType", "http://www.geneontology.org/formats/oboInOwl#hasDbXref", "http://purl.obolibrary.org/obo/HP_0000118", "https://w3id.org/babelon/comment", "http://purl.obolibrary.org/obo/HP_0033127", "http://purl.obolibrary.org/obo/HP_0002813", "http://purl.obolibrary.org/obo/HP_0002817", "http://purl.obolibrary.org/obo/HP_0001167", "https://w3id.org/babelon/translation_language", "http://www.geneontology.org/formats/oboInOwl#id", "http://purl.obolibrary.org/obo/HP_0001166", "https://w3id.org/babelon/translator", "https://w3id.org/babelon/source_value", "http://www.w3.org/2000/01/rdf-schema#subClassOf", "https://w3id.org/babelon/translator_expertise", "http://purl.obolibrary.org/obo/HP_0100807", "http://purl.obolibrary.org/obo/IAO_0000115", "https://w3id.org/babelon/translation_precision", "http://purl.obolibrary.org/obo/HP_0011842", "https://w3id.org/babelon/source_language", "https://w3id.org/babelon/source_version", "http://purl.obolibrary.org/obo/HP_0000924", "https://w3id.org/babelon/translation_confidence", "http://purl.obolibrary.org/obo/HP_0000001", "http://purl.obolibrary.org/obo/HP_0001155", "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/hp#layperson", "http://www.w3.org/2000/01/rdf-schema#label", "http://purl.obolibrary.org/obo/HP_0040064", "http://purl.obolibrary.org/obo/HP_0011844", "https://w3id.org/babelon/source", "https://w3id.org/babelon/translation_status", "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId", "http://purl.obolibrary.org/obo/HP_0040068", "https://w3id.org/babelon/translation_date" ],
    "numDescendants" : 0.0,
    "numHierarchicalDescendants" : 0.0,
    "ontologyId" : "hp",
    "ontologyIri" : "http://purl.obolibrary.org/obo/hp/hp-international.owl",
    "ontologyPreferredPrefix" : "HP",
    "searchableAnnotationValues" : [ false ],
    "shortForm" : "HP_0001166",
    "synonym" : [ {
      "type" : [ "reification" ],
      "value" : "Long slender fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, "Long, slender fingers", {
      "type" : [ "reification" ],
      "value" : "Spider fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    } ],
    "synonymProperty" : "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
    "type" : [ "class", "entity" ],
    "http://purl.obolibrary.org/obo/IAO_0000115" : [ {
      "type" : [ "reification" ],
      "value" : "Abnormally long and slender fingers (spider fingers).",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : "https://orcid.org/0000-0002-0736-9199"
      } ]
    } ],
    "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId" : "HP:0001505",
    "http://www.geneontology.org/formats/oboInOwl#hasDbXref" : [ "SNOMEDCT_US:62250003", "UMLS:C0003706" ],
    "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym" : [ {
      "type" : [ "reification" ],
      "value" : "Long slender fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    }, "Long, slender fingers", {
      "type" : [ "reification" ],
      "value" : "Spider fingers",
      "axioms" : [ {
        "http://www.geneontology.org/formats/oboInOwl#hasSynonymType" : "http://purl.obolibrary.org/obo/hp#layperson",
        "oboSynonymTypeName" : "layperson term"
      } ]
    } ],
    "http://www.geneontology.org/formats/oboInOwl#id" : "HP:0001166",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : "http://www.w3.org/2002/07/owl#Class",
    "http://www.w3.org/2000/01/rdf-schema#label" : [ "Arachnodactyly" ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf" : [ "http://purl.obolibrary.org/obo/HP_0001238", "http://purl.obolibrary.org/obo/HP_0100807" ]
  } ]
}