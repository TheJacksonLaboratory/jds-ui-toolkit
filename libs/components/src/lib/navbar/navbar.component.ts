import { CommonModule } from '@angular/common';
import { Component, Injector, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthenticationComponent} from '../auth/authentication.component';

@Component({
  selector: 'lib-jds-navbar',
  imports: [CommonModule, ButtonModule, MenubarModule,
    BadgeModule, AvatarModule, AuthenticationComponent],
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
  @Input() items: MenuItem[] = [
    {label: "Explore", icon: "", items: [
        {
          label: "News",
          url: "www.google.com/news",
          styleClass: "text-black"
        },
        {
          label: "Search",
          routerLink: "/search",
          styleClass: "text-black"
        }
      ]
    },
    {label: "Components", icon: ""},
    {label: "Contact", icon: "" }
  ];
  @Input() externalLink = "www.google.com";
  @Input() externalLinkLabel = "Link External";

  authService: AuthService | null = null;

  constructor(public injector: Injector) { }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * If authentication is enabled, retrieves the `AuthService` instance
   * from the Angular `Injector` to handle authentication-related functionality.
   */
  ngOnInit() {
    if (this.authentication) {
      this.authService = this.injector.get(AuthService);
    }
  }

  isSvg(): boolean {
    return this.logo.endsWith(".svg");
  }
}
