import { Component, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ComponentDoc } from '@jax-data-science/component-docs';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-theming',
  imports: [TableModule],
  templateUrl: './doc-theming.component.html',
  standalone: true,
})
export class DocThemingComponent {
  private docsContext = inject(DocsContextService);

  // Only ever rendered on a Components route, where currentDoc() is a ComponentDoc.
  readonly componentDoc = computed(() => this.docsContext.currentDoc() as ComponentDoc | null);
}
