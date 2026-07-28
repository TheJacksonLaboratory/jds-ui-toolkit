import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { WidgetErrorComponent } from '@jax-data-science/components';
import { widgetErrorDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-error-widget',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    WidgetErrorComponent,
  ],
  templateUrl: './showcase-error-widget.component.html',
  styleUrl: './showcase-error-widget.component.css',
  standalone: true,
})
export class ShowcaseErrorWidgetComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  readonly doc = widgetErrorDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  @ViewChild('tplDefault') tplDefault!: TemplateRef<void>;
  @ViewChild('tplLongMessage') tplLongMessage!: TemplateRef<void>;

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([
      ['default', this.tplDefault],
      ['long-message', this.tplLongMessage],
    ]);
    this.cdr.detectChanges();
  }
}
