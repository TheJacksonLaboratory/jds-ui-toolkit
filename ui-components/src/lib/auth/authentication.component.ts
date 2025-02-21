import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
// Auth0
import { AuthService } from '@auth0/auth0-angular';
// PrimeNG
import { TableModule } from 'primeng/table';

@Component({
  selector: 'lib-jds-auth',
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
  standalone: true
})
export class AuthenticationComponent implements OnInit {
  @Input() configLogin: any;
  @Input() configLogout: any;

  constructor(public auth: AuthService) { }

  /**
   * OnInit(): provides the component with default configuration options
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
   * Login parameters are passed as component configuration options
   */
  login() {
    this.auth.loginWithRedirect(this.configLogin);
  }

  /**
   * Logout parameters are passed as component configuration options
   */
  logout() {
    this.auth.logout(this.configLogout);
  }
}
