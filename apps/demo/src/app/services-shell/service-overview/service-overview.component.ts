import { Component, computed, inject } from '@angular/core';
import { ServiceDoc } from '@jax-data-science/service-docs';
import { DocsContextService } from '../../docs-shell/docs-context.service';
import { DocOverviewComponent } from '../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from '../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-service-overview',
  imports: [DocOverviewComponent, DocUsageComponent, DocActivityComponent],
  templateUrl: './service-overview.component.html',
  standalone: true,
})
export class ServiceOverviewComponent {
  private docsContext = inject(DocsContextService);

  // Only ever rendered on a Services route, where currentDoc() is a ServiceDoc.
  readonly doc = computed(() => this.docsContext.currentDoc() as ServiceDoc | null);
}
