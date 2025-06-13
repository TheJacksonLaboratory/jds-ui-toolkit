import { TestBed } from '@angular/core/testing';
import { AsyncTaskFacade } from './asynctask.facade';
import { AsyncTaskService } from '@jax-data-science/api-clients';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';
import { Filter, RunInput } from './asynctask.model';
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

  it('should filter tasks based on active filters', () => {
    const mockTasks: RunInput[] = [
      { id: 1, name: 'Task 1', description: 'Description 1', status: 1 },
      { id: 2, name: 'Task 2', description: 'Description 2', status: 2 },
    ];

    const mockFilters: Filter[] = [
      {
        name: 'Status',
        options: [],
        selectedOptions: [{ label: 'RUNNING' }],
      },
    ];

    const filteredTasks = facade.filterTasks(mockTasks, mockFilters);

    expect(filteredTasks).toEqual([
      { id: 1, name: 'Task 1', description: 'Description 1', status: 1 },
    ]);
  });

  it('should remove a filter and update active filters', () => {
    const mockActiveFilters: Filter[] = [
      {
        name: 'Description',
        options: [{ label: 'Description 1' }],
        selectedOptions: [{ label: 'Description 1' }],
      },
    ];

    const mockFilter: Filter = {
      name: 'Description',
      options: [{ label: 'Description 1' }],
      selectedOptions: [{ label: 'Description 1' }],
    };

    facade.removeFilter(mockActiveFilters, mockFilter);

    expect(mockFilter.selectedOptions).toEqual([]);
    expect(mockAsyncTaskState.setActiveFilters).toHaveBeenCalledWith([]);
  });

  it('should clear all filters and update active filters', () => {
    const mockFilters: Filter[] = [
      {
        name: 'Description',
        options: [],
        selectedOptions: [{ label: 'Description 1' }],
      },
      {
        name: 'Status',
        options: [{ label: 'RUNNING' }],
        selectedOptions: [{ label: 'RUNNING' }],
      },
    ];

    facade.clearAllFilters(mockFilters);

    mockFilters.forEach((filter) => {
      expect(filter.selectedOptions).toEqual([]);
    });
    expect(mockAsyncTaskState.setActiveFilters).toHaveBeenCalledWith([]);
  });
});
