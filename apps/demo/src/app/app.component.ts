import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JdsMenuItem, NavbarComponent } from '@jax-data-science/components';

@Component({
  imports: [
    RouterModule,
    NavbarComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'jax-data-science';
  navbarItems: JdsMenuItem[] = [
    {
      label: 'Help',
      icon: 'pi pi-external-link',
      url: 'https://google.com',
      iconEnd: true,
    },
  ];
}
