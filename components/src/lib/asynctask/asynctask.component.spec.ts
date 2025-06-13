import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncTaskComponent } from './asynctask.component';
import { AsyncTaskFacade } from './asynctask.facade';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

// Create mock for AsyncTaskFacade
const mockAsyncTaskFacade = {
  getTasks$: jest.fn().mockReturnValue(of(null)),
  openAsyncTasksEventStreaming: jest.fn().mockReturnValue(of(null)),
  fetchAsyncTasks: jest.fn(),
  addTask: jest.fn(),
  getActiveFilters$: jest.fn().mockReturnValue(of([])),
  getFilters$: jest.fn().mockReturnValue(of([])),
  getResponseError$: jest.fn().mockReturnValue(of(null)),
};

describe('AsyncTaskComponent', () => {
  let component: AsyncTaskComponent;
  let fixture: ComponentFixture<AsyncTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AsyncTaskComponent,
      ],
      providers: [
        provideHttpClient(withFetch()), // Modern approach for HTTP in tests
        { provide: AsyncTaskFacade, useValue: mockAsyncTaskFacade },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
