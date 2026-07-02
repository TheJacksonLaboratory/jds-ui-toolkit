import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Button } from 'primeng/button';
import { ProgressWidgetComponent } from '@jax-data-science/components';
import { progressWidgetDoc } from '@jax-data-science/component-docs';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';

@Component({
  selector: 'app-showcase-progress-widget',
  imports: [DocVariationsComponent, NgTemplateOutlet, ProgressWidgetComponent, Button],
  templateUrl: './showcase-progress-widget.component.html',
  styleUrl: './showcase-progress-widget.component.css',
  standalone: true,
})
export class ShowcaseProgressWidgetComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.demoTemplates.set('basic-spinner', this.tplBasicSpinner);
    this.demoTemplates.set('with-message', this.tplWithMessage);
    this.demoTemplates.set('dynamic-message', this.tplDynamicMessage);
    this.demoTemplates.set('with-icon', this.tplWithIcon);
    this.demoTemplates.set('block-ui', this.tplBlockUi);
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
