import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressWidgetComponent } from './progress-widget.component';

describe('ProgressWidgetComponent', () => {
  let component: ProgressWidgetComponent;
  let fixture: ComponentFixture<ProgressWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
