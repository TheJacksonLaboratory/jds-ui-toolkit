import { TestBed } from '@angular/core/testing';
import { AsyncTaskFacade } from './asynctask.facade';
import { AsyncTaskService } from '@jax-data-science/api-clients';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';
import { AsyncTaskState } from './asynctask.state';

// Create mock for AsyncTaskService
const mockAsyncTaskService = {
  setBaseUrl: jest.fn(),
  getRuns: jest.fn().mockReturnValue(of(null)),
  getRunEvents: jest.fn().mockReturnValue(of(null)),
  addTask: jest.fn().mockReturnValue(of(null)),
  getTasks$: jest.fn().mockReturnValue(of(null)),
};

const mockAsyncTaskState = {
  setTasks: jest.fn(),
  setActiveFilters: jest.fn(),
  getFilters$: jest.fn().mockReturnValue(of([])),
  getActiveFilters$: jest.fn().mockReturnValue(of([])),
  setUpFilters: jest.fn(),
}

describe('AsyncTaskFacade', () => {
  let facade: AsyncTaskFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AsyncTaskFacade,
        { provide: AsyncTaskService, useValue: mockAsyncTaskService },
        { provide: AsyncTaskState, useValue: mockAsyncTaskState },
        provideHttpClient(withFetch()), // Modern approach for HTTP in tests
      ],
    });

    facade = TestBed.inject(AsyncTaskFacade);
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });
});
