import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@jax-data-science/components';

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
  navbarItems =
    [
      {
        label: "Components",
        icon: "",
        items:
          [
            {
              label: "Async Tasks",
              routerLink: "docs/components/async-tasks"
            },
            {
              label: "Authentication",
              routerLink: "docs/components/authentication"
            },
            {
              label: "Error Widget",
              routerLink: "docs/components/error-widget"
            },
            {
              label: "Facet Search",
              routerLink: "docs/components/facet-search"
            },
            {
              label: "Navbar",
              routerLink: "docs/components/navbar"
            },
            {
              label: "Ontology Search",
              routerLink: "docs/components/ontology-search"
            },
            {
              label: "Schema Based Grid",
              routerLink: "docs/components/schema-grid"
            }
          ]
      },
    {
      label: "Services", icon: "", items: [
      {
        label: "Async Task",
        url: "docs/services/navbar",
      },
      {
        label: "Ontology Service",
        routerLink: "docs/services/search"
      }
    ]
  }, {label: "Help", icon: ""}]
}
