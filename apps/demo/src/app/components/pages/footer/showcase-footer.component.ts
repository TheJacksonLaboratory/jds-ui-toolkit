import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FooterComponent } from '@jax-data-science/components';

@Component({
  selector: 'app-showcase-footer',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './showcase-footer.component.html',
  styleUrl: './showcase-footer.component.css',
})
export class ShowcaseFooterComponent {
  logo = 'assets/hpo-logo-white.png';
  logoAlt = 'Human Phenotype Ontology';
  caption = 'v 2.1.4';

  items: MenuItem[] = [
    { label: 'About HPO', routerLink: '/about' },
    { label: 'License', routerLink: '/license' },
    { label: 'Funding', routerLink: '/funding' },
    { label: 'Cite', routerLink: '/citation' },
    { label: 'Meet the Team', routerLink: '/team' },
    { label: 'Site Documentation', url: 'https://hpo.jax.org/docs', target: '_blank' },
    { label: 'Disclaimer', routerLink: '/disclaimer' },
  ];
}
