import { Component, Injector, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState, AuthService, LogoutOptions, RedirectLoginOptions, User } from '@auth0/auth0-angular';
import { RouterLink } from '@angular/router';
// PrimeNG modules
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { JdsMenuItem } from './navbar.model';
import { TooltipModule } from 'primeng/tooltip';
import { AuthenticationComponent } from '../auth/authentication.component';

@Component({
  selector: 'lib-jds-navbar',
  imports: [
    AvatarModule,
    AuthenticationComponent,
    BadgeModule,
    ButtonModule,
    CommonModule,
    MenubarModule,
    TooltipModule,
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
  @Input() logo = "";
  @Input() icon = "pi pi-cog";
  @Input() logoLink = "/";

  @Input() items: JdsMenuItem[] = [
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
  @Input() authConfigLogin: RedirectLoginOptions<AppState> = {};
  @Input() authConfigLogout: LogoutOptions = {};

  public injector = inject(Injector);
  authService: AuthService | null = null;

  getAvatarImage(user: User): string | undefined {
    const picture = user.picture;
    if (picture && picture.trim().length > 0 && (picture.startsWith('http://') || picture.startsWith('https://'))) {
      return picture;
    }
    return undefined;
  }

  getUserName(user: User): string {
    return user.nickname?.trim() || user.name?.trim() || 'User';
  }

  ngOnInit() {
    if(this.authentication) {
      this.authService = this.injector.get(AuthService);
    }
  }

  getLogoImageSrc(): string | undefined {
    const trimmedLogo = this.logo.trim();

    if (!trimmedLogo) {
      return undefined;
    }

    return trimmedLogo;
  }

  getLogoIconClass(): string {
    const trimmedIcon = this.icon.trim();

    if (trimmedIcon) {
      return trimmedIcon;
    }

    return 'pi pi-cog';
  }
}