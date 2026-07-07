import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMethodsComponent } from './doc-methods.component';

describe('DocMethodsComponent', () => {
  let component: DocMethodsComponent;
  let fixture: ComponentFixture<DocMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocMethodsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
