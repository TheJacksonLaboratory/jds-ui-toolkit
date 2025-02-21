import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
// services
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {
  constructor(public auth: AuthService) { }

  login() {
    this.auth.loginWithRedirect({
      // TO-DO: target should be dynamically configured by the host application
      appState: { target: '/search' }
    });
  }

  logout() {
    this.auth.logout({
      // TO-DO: returnTo should be dynamically configured by the host application
      logoutParams: {
        returnTo: document.location.origin
      }
    });
  }
}
