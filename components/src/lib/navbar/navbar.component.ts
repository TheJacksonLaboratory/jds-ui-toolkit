import { CommonModule } from '@angular/common';
import { Component, Injector, Input, OnInit, ViewEncapsulation } from '@angular/core';
// Auth0
import { AuthService } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'lib-jds-navbar',
  imports: [CommonModule, ButtonModule, MenubarModule,
    BadgeModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  @Input() authentication = false;
  @Input() title = "JDS Angular Application";
  @Input() logo = "";
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

  private authService: AuthService | null = null;

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
}
