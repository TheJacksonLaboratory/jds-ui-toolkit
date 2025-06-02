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
    component.task = {
      id: 1,
      name: 'Test Task',
      description: 'This is a test task',
      status: 1,
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
