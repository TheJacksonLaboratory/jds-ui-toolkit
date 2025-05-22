import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncTaskDetailsComponent } from './asynctask-details.component';

describe('AsyncTaskDetailsComponent', () => {
  let component: AsyncTaskDetailsComponent;
  let fixture: ComponentFixture<AsyncTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncTaskDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
