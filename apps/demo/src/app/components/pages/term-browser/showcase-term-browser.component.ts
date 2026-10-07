import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { JdsTermBrowserComponent, JdsTermBrowserFacade } from '@jax-data-science/components';
import { termBrowserDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

/** Terms worth looking at: one reached by many routes, one with children to expand. */
const EXAMPLES = [
  { id: 'HP:0001166', label: 'Arachnodactyly' },
  { id: 'HP:0000822', label: 'Hypertension' },
  { id: 'HP:0001250', label: 'Seizure' },
];

@Component({
  selector: 'app-showcase-term-browser',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    JdsTermBrowserComponent,
  ],
  templateUrl: './showcase-term-browser.component.html',
  standalone: true,
})
export class ShowcaseTermBrowserComponent implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  readonly facade = inject(JdsTermBrowserFacade);
  readonly doc = termBrowserDoc;
  readonly examples = EXAMPLES;

  demoTemplates = new Map<string, TemplateRef<void>>();
  selectedId = EXAMPLES[0].id;

  ngOnInit(): void {
    this.facade.load(this.selectedId);
  }

  /**
   * Rebuild the tree around another term.
   * @param id - the term to centre on
   */
  show(id: string): void {
    this.selectedId = id;
    this.facade.load(id);
  }

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([
      ['live', this.tplLive],
    ]);
    this.cdr.detectChanges();
  }

  @ViewChild('tplLive') tplLive!: TemplateRef<void>;
}
