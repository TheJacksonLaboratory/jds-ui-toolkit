import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ShowcaseFacetSearchComponent } from './showcase-facet-search.component';

describe('ShowcaseFacetSearchComponent', () => {
  let component: ShowcaseFacetSearchComponent;
  let fixture: ComponentFixture<ShowcaseFacetSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseFacetSearchComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseFacetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
