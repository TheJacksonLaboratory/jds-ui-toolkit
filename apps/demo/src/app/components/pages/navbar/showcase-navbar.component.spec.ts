import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { ShowcaseNavbarComponent } from './showcase-navbar.component';

const mockAuthService = {
  isAuthenticated$: of(false),
  user$: of(null),
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
};

describe('ShowcaseNavbarComponent', () => {
  let component: ShowcaseNavbarComponent;
  let fixture: ComponentFixture<ShowcaseNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseNavbarComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
