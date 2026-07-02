import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-api',
  imports: [TableModule, TagModule],
  templateUrl: './doc-api.component.html',
  standalone: true,
})
export class DocApiComponent {
  readonly docsContext = inject(DocsContextService);
}
