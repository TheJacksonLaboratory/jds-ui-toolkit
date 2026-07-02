import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-theming',
  imports: [TableModule],
  templateUrl: './doc-theming.component.html',
  standalone: true,
})
export class DocThemingComponent {
  readonly docsContext = inject(DocsContextService);
}
