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
              routerLink: "components/docs/async-tasks"
            },
            {
              label: "Authentication",
              routerLink: "components/docs/authentication"
            },
            {
              label: "Error Widget",
              routerLink: "components/docs/error-widget"
            },
            {
              label: "Facet Search",
              routerLink: "components/docs/facet-search"
            },
            {
              label: "Navbar",
              routerLink: "components/docs/navbar"
            },
            {
              label: "Ontology Search",
              routerLink: "components/docs/ontology-search"
            },
            {
              label: "Progress Widget",
              routerLink: "components/docs/progress-widget"
            },
            {
              label: "Schema Based Grid",
              routerLink: "components/docs/schema-grid"
            }
          ]
      },
      {
        label: "Services",
        icon: "",
        items:
          [
            {
              label: "ISA Data",
              routerLink: "services/docs/isa-data",
            }
          ]
      },
      {
        label: "Help",
        icon: ""
      }
    ]
}
