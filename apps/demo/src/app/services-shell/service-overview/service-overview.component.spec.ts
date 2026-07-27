import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOverviewComponent } from './service-overview.component';

describe('ServiceOverviewComponent', () => {
  let component: ServiceOverviewComponent;
  let fixture: ComponentFixture<ServiceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
