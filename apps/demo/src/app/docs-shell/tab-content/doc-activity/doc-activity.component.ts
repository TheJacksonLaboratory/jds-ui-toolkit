import { Component, inject } from '@angular/core';
import { DocsContextService } from '../../docs-context.service';

@Component({
  selector: 'app-doc-activity',
  imports: [],
  standalone: true,
  template: `
    @let doc = docsContext.currentDoc();
    @if (doc?.activity) {
      <section id="activity" class="tw-mt-12">
        <div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
          <h2 class="tw-text-2xl tw-font-semibold tw-m-0">Component Activity</h2>
          <a href="#activity" class="tw-text-gray-400 hover:tw-text-blue-600 tw-transition-colors" aria-label="Link to section">
            <i class="pi pi-link tw-text-sm"></i>
          </a>
        </div>
        <p class="tw-text-sm tw-uppercase tw-tracking-wide tw-text-gray-400 tw-mb-2">Activity / Measure</p>
        <p class="tw-text-gray-700 tw-leading-relaxed tw-max-w-3xl">{{ doc!.activity!.summary }}</p>
      </section>
    }
  `,
})
export class DocActivityComponent {
  readonly docsContext = inject(DocsContextService);
}
