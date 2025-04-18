import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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

  @Input() authentication: boolean = false;
  @Input() title: string = "";
  @Input() logo: string = "";
  @Input() items: MenuItem[] = [];

  constructor(public auth: AuthService) { }

  /**
   * OnInit(): provides the components with default configuration options
   */
  ngOnInit() {
  }
}
