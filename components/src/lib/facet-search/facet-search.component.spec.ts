import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacetSearchComponent } from './facet-search.component';

describe('FacetSearchComponent', () => {
  let component: FacetSearchComponent;
  let fixture: ComponentFixture<FacetSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacetSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FacetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
