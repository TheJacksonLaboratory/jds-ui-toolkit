import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsynctaskFilterComponent } from './asynctask-filter.component';

describe('AsynctaskFilterComponent', () => {
  let component: AsynctaskFilterComponent;
  let fixture: ComponentFixture<AsynctaskFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsynctaskFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsynctaskFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
