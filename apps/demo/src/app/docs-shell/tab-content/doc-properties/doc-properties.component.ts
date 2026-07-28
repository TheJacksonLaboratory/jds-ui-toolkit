import { Component, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiDoc, ComponentDoc } from '@jax-data-science/component-docs';
import { DocsContextService } from '../../docs-context.service';
import { COMPONENT_PROPERTIES } from '../../generated/component-properties.generated';

const EMPTY: ApiDoc = { inputs: [], outputs: [] };

@Component({
  selector: 'app-doc-properties',
  imports: [TableModule, TagModule],
  templateUrl: './doc-properties.component.html',
  standalone: true,
})
export class DocPropertiesComponent {
  readonly docsContext = inject(DocsContextService);

  /** Prefer the Compodoc-generated map; fall back to hand-authored front-matter. */
  readonly properties = computed<ApiDoc>(() => {
    // Only ever rendered on a Components route, where currentDoc() is a ComponentDoc.
    const doc = this.docsContext.currentDoc() as ComponentDoc | null;
    if (!doc) return EMPTY;
    return COMPONENT_PROPERTIES[doc.compodocSymbol] ?? doc.properties ?? EMPTY;
  });
}
