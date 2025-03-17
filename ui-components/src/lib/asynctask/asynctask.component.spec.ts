import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncTaskComponent } from './asynctask.component';

describe('AsyncTaskComponent', () => {
  let component: AsyncTaskComponent;
  let fixture: ComponentFixture<AsyncTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
