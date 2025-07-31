import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OntologySearchComponent } from './ontology-search.component';
import { OntologyService } from '@jax-data-science/api-clients';
describe('OntologySearchComponent', () => {
  let component: OntologySearchComponent;
  let fixture: ComponentFixture<OntologySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OntologySearchComponent],
      providers: [{provide: OntologyService, useValue: {} }] // Mock the OntologyService
    }).compileComponents();

    fixture = TestBed.createComponent(OntologySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
