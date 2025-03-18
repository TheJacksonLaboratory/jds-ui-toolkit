import { TestBed } from '@angular/core/testing';
import { AsyncTaskFacade } from './asynctask.facade';
import { AsyncTaskService } from '@jax-data-science-demo/api-clients';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

// Create mock for AsyncTaskService
const mockAsyncTaskService = {
  getRuns: jest.fn().mockReturnValue(of(null)),
  getRunEvents: jest.fn().mockReturnValue(of(null)),
  addTask: jest.fn().mockReturnValue(of(null)),
  getTasks$: jest.fn().mockReturnValue(of(null)),
};

describe('AsyncTaskFacade', () => {
  let facade: AsyncTaskFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AsyncTaskFacade,
        { provide: AsyncTaskService, useValue: mockAsyncTaskService },
        provideHttpClient(withFetch()), // Modern approach for HTTP in tests
      ],
    });

    facade = TestBed.inject(AsyncTaskFacade);
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });
});
