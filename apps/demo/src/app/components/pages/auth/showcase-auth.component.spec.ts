import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { ShowcaseAuthComponent } from './showcase-auth.component';

const mockAuthService = {
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
  isAuthenticated$: of(false),
};

describe('ShowcaseAuthComponent', () => {
  let component: ShowcaseAuthComponent;
  let fixture: ComponentFixture<ShowcaseAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseAuthComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
