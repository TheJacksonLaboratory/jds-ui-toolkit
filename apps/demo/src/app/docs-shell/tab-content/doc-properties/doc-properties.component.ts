import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-properties',
  imports: [TableModule, TagModule],
  templateUrl: './doc-properties.component.html',
  standalone: true,
})
export class DocPropertiesComponent {
  readonly docsContext = inject(DocsContextService);
}
