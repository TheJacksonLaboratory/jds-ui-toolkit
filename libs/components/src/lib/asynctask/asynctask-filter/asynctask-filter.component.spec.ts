import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncTaskFilterComponent } from './asynctask-filter.component';
import { AsyncTaskFacade } from '../asynctask.facade';
import { of } from 'rxjs';
import { Filter } from '../asynctask.model';

describe('AsyncTaskFilterComponent', () => {
  let component: AsyncTaskFilterComponent;
  let fixture: ComponentFixture<AsyncTaskFilterComponent>;

  const mockFacade = {
    getFilters$: jest.fn().mockReturnValue(of([])),
    getActiveFilters$: jest.fn().mockReturnValue(of([])),
    setActiveFilters: jest.fn(),
    removeFilter: jest.fn(),
    clearAllFilters: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncTaskFilterComponent],
      providers: [
        {
          provide: AsyncTaskFacade,
          useValue: mockFacade,
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncTaskFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setActiveFilters with selected filters on onFilterChange', () => {
    component.filters = [
      {
        name: 'Status',
        options: [{ label: 'COMPLETED' }],
        selectedOptions: [{ label: 'COMPLETED' }],
      },
      {
        name: 'Description',
        options: [{ label: 'Task 1' }],
        selectedOptions: [],
      },
    ];

    component.onFilterChange();

    expect(mockFacade.setActiveFilters).toHaveBeenCalledWith([
      {
        name: 'Status',
        options: [{ label: 'COMPLETED' }],
        selectedOptions: [{ label: 'COMPLETED' }],
      },
    ]);
  });

  it('should call removeFilter with the correct arguments', () => {
    const mockFilter: Filter = {
      name: 'Status',
      options: [{ label: 'COMPLETED' }],
      selectedOptions: [{ label: 'COMPLETED' }],
    };

    component.activeFilters = [mockFilter];

    component.removeFilter(mockFilter);

    expect(mockFacade.removeFilter).toHaveBeenCalledWith(
      component.activeFilters,
      mockFilter
    );
  });

  it('should call clearAllFilters with the correct arguments', () => {
    const mockActiveFilters: Filter[] = [
      {
        name: 'Status',
        options: [{ label: 'COMPLETED' }],
        selectedOptions: [{ label: 'COMPLETED' }],
      },
      {
        name: 'Description',
        options: [{ label: 'Task 1' }],
        selectedOptions: [{ label: 'Task 1' }],
      },
    ];

    component.activeFilters = mockActiveFilters;

    component.clearAllFilters();

    expect(mockFacade.clearAllFilters).toHaveBeenCalledWith(mockActiveFilters);
  });
});
