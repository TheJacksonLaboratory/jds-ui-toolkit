import { Component, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiMethodDoc, ServiceDoc } from '@jax-data-science/service-docs';
import { DocsContextService } from '../../docs-context.service';
import { SERVICE_METHODS } from '../../generated/service-methods.generated';

const EMPTY: ApiMethodDoc = { methods: [] };

@Component({
  selector: 'app-doc-methods',
  imports: [TableModule],
  templateUrl: './doc-methods.component.html',
  standalone: true,
})
export class DocMethodsComponent {
  readonly docsContext = inject(DocsContextService);

  /** Prefer the Compodoc-generated map; fall back to hand-authored front-matter. */
  readonly apiMethods = computed<ApiMethodDoc>(() => {
    const doc = this.docsContext.currentDoc() as ServiceDoc | null;
    if (!doc) return EMPTY;
    return SERVICE_METHODS[doc.compodocSymbol] ?? doc.methods ?? EMPTY;
  });
}
