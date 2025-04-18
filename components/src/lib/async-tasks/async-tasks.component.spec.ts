import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncTasksComponent } from './async-tasks.component';

describe('AsyncTasksComponent', () => {
  let component: AsyncTasksComponent;
  let fixture: ComponentFixture<AsyncTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
