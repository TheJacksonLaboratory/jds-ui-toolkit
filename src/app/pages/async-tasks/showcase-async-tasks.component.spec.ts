import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseAsyncTasksComponent } from './showcase-async-tasks.component';

describe('ShowcaseAsyncTasksComponent', () => {
  let component: ShowcaseAsyncTasksComponent;
  let fixture: ComponentFixture<ShowcaseAsyncTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseAsyncTasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseAsyncTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
