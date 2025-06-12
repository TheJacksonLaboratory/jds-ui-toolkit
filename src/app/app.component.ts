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
  items = [{label: "Components", icon: "", items: [
      {
        label: "Navbar",
        url: "docs/components/navbar",
      },
      {
        label: "Ontology Search",
        routerLink: "docs/components/search"
      }
    ]
  }, {label: "Services", icon: "", items: [
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
