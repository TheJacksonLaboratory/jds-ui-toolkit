import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseErrorWidgetComponent } from './showcase-error-widget.component';

describe('ShowcaseErrorWidgetComponent', () => {
  let component: ShowcaseErrorWidgetComponent;
  let fixture: ComponentFixture<ShowcaseErrorWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseErrorWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseErrorWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
