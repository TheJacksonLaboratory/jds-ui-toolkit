import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  imports: [
    RouterModule,
    MenubarModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'jax-data-science';
  readonly menuItems: MenuItem[] = [
    { label: 'Components', routerLink: '/components' },
    { label: 'Services', routerLink: '/services' },
  ];
}
