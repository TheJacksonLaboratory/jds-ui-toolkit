import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseAsyncTasksComponent } from './showcase-async-tasks.component';
import { AsyncTaskFacade } from '@jax-data-science-demo/ui-components';
// import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

// Create mock for AsyncTaskFacade
const mockAsyncTaskFacade = {
  fetchAsyncTasks: jest.fn().mockReturnValue(of(null)),
  openAsyncTasksEventStreaming: jest.fn().mockReturnValue(of(null)),
  addTask: jest.fn().mockReturnValue(true),
  updateTask: jest.fn().mockReturnValue(true),
  getTasks$: jest.fn().mockReturnValue(of(null)),
  getActiveFilters$: jest.fn().mockReturnValue(of([])),
  setActiveFilters: jest.fn(),
  getFilteredTasks$: jest.fn().mockReturnValue(of([])),
  getFilters$: jest.fn().mockReturnValue(of([])),
  setFilters: jest.fn(),
};

const mockAuthService = {
  getAccessTokenSilently: jest.fn().mockReturnValue(of('mock-token'))
};

describe('ShowcaseAsyncTasksComponent', () => {
  let component: ShowcaseAsyncTasksComponent;
  let fixture: ComponentFixture<ShowcaseAsyncTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseAsyncTasksComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AsyncTaskFacade, useValue: mockAsyncTaskFacade },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseAsyncTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
