import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild, inject } from '@angular/core';
import { FacetSearchComponent, FacetSearchFacade, IFacetSearchCategory } from '@jax-data-science/components';
import { facetSearchDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

// Static mock categories for the demo — the legacy showcase called a
// non-existent local backend (localhost:28080) which always failed; using
// fixed data here keeps the demo deterministic and actually filterable.
const MOCK_CATEGORIES: IFacetSearchCategory[] = [
  {
    name: 'species',
    label: 'Species',
    isOpen: true,
    options: [
      { id: 'mouse', label: 'Mouse', selected: false, count: 128 },
      { id: 'human', label: 'Human', selected: false, count: 42 },
      { id: 'rat', label: 'Rat', selected: false, count: 0 },
    ],
  },
  {
    name: 'sex',
    label: 'Sex',
    isOpen: false,
    options: [
      { id: 'male', label: 'Male', selected: false, count: 86 },
      { id: 'female', label: 'Female', selected: false, count: 84 },
    ],
  },
];

@Component({
  selector: 'app-showcase-facet-search',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    FacetSearchComponent,
  ],
  templateUrl: './showcase-facet-search.component.html',
  styleUrl: './showcase-facet-search.component.css',
  standalone: true,
})
export class ShowcaseFacetSearchComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private facetSearchFacade = inject(FacetSearchFacade);
  readonly doc = facetSearchDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  readonly categories = MOCK_CATEGORIES;

  @ViewChild('tplBasic') tplBasic!: TemplateRef<void>;
  @ViewChild('facetContainer') facetContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([['basic', this.tplBasic]]);
    // the drawer is only shown when the facade's visibility signal is true
    this.facetSearchFacade.setIsSearchVisible(true);
    this.cdr.detectChanges();
  }
}
