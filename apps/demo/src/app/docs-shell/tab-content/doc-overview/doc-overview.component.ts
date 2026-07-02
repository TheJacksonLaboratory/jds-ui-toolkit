import { Component, inject } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-overview',
  imports: [TagModule],
  templateUrl: './doc-overview.component.html',
  standalone: true,
})
export class DocOverviewComponent {
  readonly docsContext = inject(DocsContextService);
}
