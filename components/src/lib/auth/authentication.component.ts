import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
// Auth0
import { AppState, AuthService, LogoutOptions, RedirectLoginOptions } from '@auth0/auth0-angular';

@Component({
  selector: 'lib-jds-auth',
  imports: [CommonModule, ButtonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
  standalone: true
})
export class AuthenticationComponent implements OnInit {
  @Input() configLogin: RedirectLoginOptions<AppState>;
  @Input() configLogout: LogoutOptions;

  constructor(public auth: AuthService) { }

  /**
   * OnInit(): provides the components with default configuration options
   */
  ngOnInit() {
    this.configLogin = {
      appState: { target: '/search' },
      ...this.configLogin
    };

    this.configLogout = {
      logoutParams: {
        returnTo: document.location.origin
      },
      ...this.configLogout
    };
  }

  /**
   * Login parameters are passed as components configuration options
   */
  login() {
    this.auth.loginWithRedirect(this.configLogin);
  }

  /**
   * Logout parameters are passed as components configuration options
   */
  logout() {
    this.auth.logout(this.configLogout);
  }
}
