import { Component } from '@angular/core';
import { ontologyDoc } from '@jax-data-science/service-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-ontology',
  imports: [DocOverviewComponent, DocUsageComponent, DocActivityComponent],
  templateUrl: './showcase-ontology.component.html',
  styleUrl: './showcase-ontology.component.css',
  standalone: true,
})
export class ShowcaseOntologyComponent {
  readonly doc = ontologyDoc;
}
