import { Component, inject } from '@angular/core';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-usage',
  imports: [],
  templateUrl: './doc-usage.component.html',
  standalone: true,
})
export class DocUsageComponent {
  readonly docsContext = inject(DocsContextService);
}
