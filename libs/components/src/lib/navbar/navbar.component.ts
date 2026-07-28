import { Component, Injector, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState, AuthService, LogoutOptions, RedirectLoginOptions, User } from '@auth0/auth0-angular';
import { RouterLink } from '@angular/router';
// PrimeNG modules
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
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
  /** Shows the login/avatar auth controls when true; requires an `AuthService` provider in the app. */
  @Input() authentication = false;
  /** Application name shown in the navbar's brand area. */
  @Input() title = "JDS Angular Application";
  /** Optional image URL for the brand logo; falls back to `icon` when empty. */
  @Input() logo = "";
  /** PrimeIcons class (e.g. `pi-cog`) shown as the brand mark when `logo` is not set. */
  @Input() icon = "pi-cog";
  /** Router link the brand logo/title navigates to when clicked. */
  @Input() logoLink = "/";

  /** Menu items rendered in the PrimeNG menubar; supports nested items, router links, and click commands. */
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
  /** URL for the external link shown at the end of the navbar (e.g. a GitHub repo). */
  @Input() externalLink = "https://github.com/TheJacksonLaboratory/jds-ui-components";
  /** Label text for the external link. */
  @Input() externalLinkLabel = "GitHub";
  /** Auth0 redirect-login options forwarded to the embedded Authentication component when `authentication` is true. */
  @Input() authConfigLogin: RedirectLoginOptions<AppState> = {};
  /** Auth0 logout options forwarded to the embedded Authentication component when `authentication` is true. */
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

  onItemClick(event: MouseEvent, item: JdsMenuItem): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }

  resolveIconClass(item: JdsMenuItem): string {
    const base = item.icon!.startsWith('pi pi-') ? item.icon! : 'pi ' + item.icon!;
    return item.iconClass ? `${base} ${item.iconClass}` : base;
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
      return trimmedIcon.startsWith('pi pi-') ? trimmedIcon : 'pi ' + trimmedIcon;
    }

    return 'pi pi-cog';
  }
}