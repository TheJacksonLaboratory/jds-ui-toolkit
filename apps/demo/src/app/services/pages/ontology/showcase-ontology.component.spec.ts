import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { JaxOntologyService, OLSOntologyService } from '@jax-data-science/api-clients';

import { ShowcaseOntologyComponent } from './showcase-ontology.component';

const mockCollectionResponse = {
  data: [{ id: 'HP:0001945', name: 'Fever' }],
  paging: { page: 1, total_pages: 1, total_items: 1 },
};

const mockJaxOntology = { search: jest.fn().mockReturnValue(of(mockCollectionResponse)) };
const mockOlsOntology = { search: jest.fn().mockReturnValue(of(mockCollectionResponse)) };

describe('ShowcaseOntologyComponent', () => {
  let component: ShowcaseOntologyComponent;
  let fixture: ComponentFixture<ShowcaseOntologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseOntologyComponent],
      providers: [
        { provide: JaxOntologyService, useValue: mockJaxOntology },
        { provide: OLSOntologyService, useValue: mockOlsOntology },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
