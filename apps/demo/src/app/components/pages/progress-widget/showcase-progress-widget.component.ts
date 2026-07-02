import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressWidgetComponent } from '@jax-data-science/components';
import { progressWidgetDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-progress-widget',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    ProgressWidgetComponent,
    Button,
  ],
  templateUrl: './showcase-progress-widget.component.html',
  styleUrl: './showcase-progress-widget.component.css',
  standalone: true,
})
export class ShowcaseProgressWidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  readonly doc = progressWidgetDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  message = 'Loading...';
  isLoading = true;
  blockUi = false;
  unblockMessage = '';
  private intervalId?: ReturnType<typeof setInterval>;

  @ViewChild('tplBasicSpinner') tplBasicSpinner!: TemplateRef<void>;
  @ViewChild('tplWithMessage') tplWithMessage!: TemplateRef<void>;
  @ViewChild('tplDynamicMessage') tplDynamicMessage!: TemplateRef<void>;
  @ViewChild('tplWithIcon') tplWithIcon!: TemplateRef<void>;
  @ViewChild('tplBlockUi') tplBlockUi!: TemplateRef<void>;

  ngOnInit(): void {
    setTimeout(() => {
      this.message = 'Done!';
      this.isLoading = false;
    }, 3000);
  }

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([
      ['basic-spinner', this.tplBasicSpinner],
      ['with-message', this.tplWithMessage],
      ['dynamic-message', this.tplDynamicMessage],
      ['with-icon', this.tplWithIcon],
      ['block-ui', this.tplBlockUi],
    ]);
    this.cdr.detectChanges();
  }

  toggleBlockUi(): void {
    this.blockUi = true;
    this.unblockMessage = 'UI is blocked';
    let countdown = 4;
    this.intervalId = setInterval(() => {
      countdown--;
      this.unblockMessage = `Unblocking in ${countdown}...`;
      if (countdown === 0) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.blockUi = false;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
