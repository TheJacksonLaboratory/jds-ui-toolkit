import { Component, inject } from '@angular/core';
import { DocsContextService } from '../../docs-context.service';
import { CopySectionLinkComponent } from '../copy-section-link/copy-section-link.component';

@Component({
  selector: 'app-doc-usage',
  imports: [CopySectionLinkComponent],
  templateUrl: './doc-usage.component.html',
  standalone: true,
})
export class DocUsageComponent {
  readonly docsContext = inject(DocsContextService);
}
