import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { JdsTerm, JdsTermBrowserComponent, JdsTermSelectEvent } from '@jax-data-science/components';
import { buildTermTree } from '@jax-data-science/api-clients';
import { termBrowserDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';
import {
  ARACHNODACTYLY_ANCESTORS,
  ARACHNODACTYLY_FOCUS,
  HYPERTENSION_ANCESTORS,
  HYPERTENSION_CHILDREN,
  HYPERTENSION_FOCUS
} from './term-browser.fixtures';

@Component({
  selector: 'app-showcase-term-browser',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    JdsTermBrowserComponent
  ],
  templateUrl: './showcase-term-browser.component.html',
  standalone: true
})
export class ShowcaseTermBrowserComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  readonly doc = termBrowserDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  /** Arachnodactyly: fifteen ancestors over eight routes, thirty-seven rows. */
  readonly polyTree = buildTermTree(ARACHNODACTYLY_FOCUS, ARACHNODACTYLY_ANCESTORS).roots;
  /** Hypertension: one route, with children to expand. */
  readonly singleTree = buildTermTree(HYPERTENSION_FOCUS, HYPERTENSION_ANCESTORS).roots;

  readonly polyFocus = signal<JdsTerm | null>(ARACHNODACTYLY_FOCUS);
  readonly singleFocus = signal<JdsTerm | null>(HYPERTENSION_FOCUS);
  readonly lastSelected = signal<string>('');

  /** Stands in for an ontology client, so the page needs no backend. */
  readonly resolveChildren = (term: JdsTerm) =>
    of(term.id === HYPERTENSION_FOCUS.id ? HYPERTENSION_CHILDREN : []);

  /**
   * Record which route was taken to the chosen term.
   * @param event - the term chosen, and the ids leading to it
   */
  onSelect(event: JdsTermSelectEvent): void {
    this.lastSelected.set(`${event.term.name} — ${event.path.join(' › ')}`);
  }

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([
      ['polyhierarchy', this.tplPolyhierarchy],
      ['single-path', this.tplSinglePath],
      ['narrow', this.tplNarrow]
    ]);
    this.cdr.detectChanges();
  }

  @ViewChild('tplPolyhierarchy') tplPolyhierarchy!: TemplateRef<void>;
  @ViewChild('tplSinglePath') tplSinglePath!: TemplateRef<void>;
  @ViewChild('tplNarrow') tplNarrow!: TemplateRef<void>;
}
