import { Component, OnInit, inject } from '@angular/core';
import { TocContextService } from '../../../getting-started-shell/toc-context.service';

@Component({
  selector: 'app-getting-started-overview',
  imports: [],
  templateUrl: './getting-started-overview.component.html',
  standalone: true,
})
export class GettingStartedOverviewComponent implements OnInit {
  private tocContext = inject(TocContextService);

  ngOnInit(): void {
    this.tocContext.setHeadings([
      { id: 'jax-data-science-ui-toolkit', title: 'JAX Data Science UI Toolkit' },
      { id: 'installation', title: 'Installation' },
      { id: 'community', title: 'Community' },
    ]);
  }
}
