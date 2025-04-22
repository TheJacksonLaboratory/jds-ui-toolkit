import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseAsyncTasksComponent } from './showcase-async-tasks.component';
import { AsyncTaskFacade } from '@jax-data-science-demo/ui-components';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

// Create mock for AsyncTaskFacade
const mockAsyncTaskFacade = {
  getTasks$: jest.fn().mockReturnValue(of(null)),
  fetchAsyncTasks: jest.fn(),
  openAsyncTaskEventListener: jest.fn(),
  addTask: jest.fn(),
};

describe('ShowcaseAsyncTasksComponent', () => {
  let component: ShowcaseAsyncTasksComponent;
  let fixture: ComponentFixture<ShowcaseAsyncTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseAsyncTasksComponent],
      providers: [
        provideHttpClient(withFetch()), // Modern approach for HTTP in tests
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
