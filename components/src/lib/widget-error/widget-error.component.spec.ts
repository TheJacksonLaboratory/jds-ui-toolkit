import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetErrorComponent } from './widget-error.component';

describe('WidgetErrorComponent', () => {
  let component: WidgetErrorComponent;
  let fixture: ComponentFixture<WidgetErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
