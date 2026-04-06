import { Component, Input, inject } from '@angular/core';
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
export class AuthenticationComponent {
  public auth = inject(AuthService);

  @Input() configLogin: RedirectLoginOptions<AppState>= {};
  @Input() configLogout: LogoutOptions = {};

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
    const defaultLogoutConfig: LogoutOptions = {
      logoutParams: {
        returnTo: document.location.origin
      }
    };

    const hasCustomLogoutConfig = Object.keys(this.configLogout).length > 0;
    const logoutConfig: LogoutOptions = hasCustomLogoutConfig
      ? {
          ...defaultLogoutConfig,
          ...this.configLogout,
          logoutParams: {
            ...(defaultLogoutConfig.logoutParams ?? {}),
            ...(this.configLogout.logoutParams ?? {})
          }
        }
      : defaultLogoutConfig;

    this.auth.logout(logoutConfig);
  }
}
