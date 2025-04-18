import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { AuthenticationComponent} from '@jds-angular/components';

@Component({
  selector: 'app-showcase-auth',
  imports: [CommonModule, ButtonModule, AuthenticationComponent],
  templateUrl: './showcase-auth.component.html',
  styleUrl: './showcase-auth.component.css',
  standalone: true
})
export class ShowcaseAuthComponent {
  configLogin = {
    appState: { target: '/search/authentication' }
  };

  configLogout = {
    logoutParams: {
      returnTo: document.location.origin
    }
  };
}
