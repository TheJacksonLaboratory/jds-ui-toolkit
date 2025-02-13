import { TestBed } from '@angular/core/testing';

import { OntologyService } from './ontology.service';

describe('OntologyService', () => {
  let service: OntologyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [OntologyService],
    });

    service = TestBed.inject(OntologyService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
