import { Component } from '@angular/core';


import { ButtonModule } from 'primeng/button';

import { AuthenticationComponent} from '@jax-data-science/components';

@Component({
  selector: 'app-showcase-auth',
  imports: [ButtonModule, AuthenticationComponent],
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
