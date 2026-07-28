import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStartedOverviewComponent } from './getting-started-overview.component';

describe('GettingStartedOverviewComponent', () => {
  let component: GettingStartedOverviewComponent;
  let fixture: ComponentFixture<GettingStartedOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GettingStartedOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GettingStartedOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
