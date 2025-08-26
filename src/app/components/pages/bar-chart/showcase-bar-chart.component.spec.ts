import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseBarChartComponent } from './showcase-bar-chart.component';

describe('ShowcaseBarChartComponent', () => {
  let component: ShowcaseBarChartComponent;
  let fixture: ComponentFixture<ShowcaseBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
