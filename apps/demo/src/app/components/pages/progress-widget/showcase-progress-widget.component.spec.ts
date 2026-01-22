import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseProgressWidgetComponent } from './showcase-progress-widget.component';

describe('ShowcaseProgressWidgetComponent', () => {
  let component: ShowcaseProgressWidgetComponent;
  let fixture: ComponentFixture<ShowcaseProgressWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseProgressWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowcaseProgressWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
