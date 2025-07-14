import { Component, Injector, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { RouterLink } from '@angular/router';
// PrimeNG modules
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
// components
import { AuthenticationComponent} from '@jax-data-science/components';

@Component({
  selector: 'lib-jds-navbar',
  imports: [
    AvatarModule,
    AuthenticationComponent,
    BadgeModule,
    ButtonModule,
    CommonModule,
    MenubarModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  @Input() authentication = false;
  @Input() title = "JDS Angular Application";
  @Input() logo = "https://media.jax.org/m/70a126ca6332fe5a/webimage-logo.png";
  @Input() logoLink = "/";

  // default menu items
  @Input() items: MenuItem[] = [
    {
      label: "Explore",
      icon: "",
      items: [
        {
          label: "News",
          url: "www.google.com/news",
          styleClass: "text-black"
        }, {
          label: "Search",
          routerLink: "/search",
          styleClass: "text-black"
        }
      ]
    }, {
      label: "Components",
      icon: ""
    }, {
      label: "Contact",
      icon: ""
    }
  ];
  @Input() externalLink = "https://github.com/TheJacksonLaboratory/jds-ui-components";
  @Input() externalLinkLabel = "GitHub";

  authService: AuthService | null = null;

  constructor(public injector: Injector) { }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * If authentication is enabled, retrieves the `AuthService` instance
   * from the Angular `Injector` to handle authentication-related functionality.
   */
  ngOnInit() {
    if(this.authentication) {
      this.authService = this.injector.get(AuthService);
    }
  }

  isSvg(): boolean {
    return this.logo.endsWith(".svg");
  }
}
