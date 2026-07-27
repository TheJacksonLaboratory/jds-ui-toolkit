import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NavbarComponent } from '@jax-data-science/components';
import { navbarDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-navbar',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    NavbarComponent,
  ],
  templateUrl: './showcase-navbar.component.html',
  styleUrl: './showcase-navbar.component.css',
  standalone: true,
})
export class ShowcaseNavbarComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  readonly doc = navbarDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  @ViewChild('tplBasic') tplBasic!: TemplateRef<void>;
  @ViewChild('tplWithAuth') tplWithAuth!: TemplateRef<void>;
  @ViewChild('tplCustomBranding') tplCustomBranding!: TemplateRef<void>;

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([
      ['basic', this.tplBasic],
      ['with-auth', this.tplWithAuth],
      ['custom-branding', this.tplCustomBranding],
    ]);
    this.cdr.detectChanges();
  }
}
