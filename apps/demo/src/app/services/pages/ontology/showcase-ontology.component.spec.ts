import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseOntologyComponent } from './showcase-ontology.component';

describe('ShowcaseOntologyComponent', () => {
  let component: ShowcaseOntologyComponent;
  let fixture: ComponentFixture<ShowcaseOntologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseOntologyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
