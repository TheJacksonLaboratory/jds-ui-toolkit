import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ALL_DOCS } from '../docs-shell/docs-shell.component';
import { ALL_SERVICE_DOCS } from '../services-shell/services-shell.component';
import { DocsLeftNavComponent } from '../docs-shell/docs-left-nav/docs-left-nav.component';
import { GettingStartedTocComponent } from './getting-started-toc/getting-started-toc.component';

@Component({
  selector: 'app-getting-started-shell',
  imports: [RouterModule, DocsLeftNavComponent, GettingStartedTocComponent],
  templateUrl: './getting-started-shell.component.html',
  standalone: true,
  host: { class: 'tw-flex tw-flex-1 tw-h-full tw-w-full tw-overflow-hidden' },
})
export class GettingStartedShellComponent {
  readonly allDocs = ALL_DOCS;
  readonly allServices = ALL_SERVICE_DOCS;
}
