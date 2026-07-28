import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { AuthenticationComponent } from '@jax-data-science/components';
import { authenticationDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-auth',
  imports: [
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    AuthenticationComponent,
  ],
  templateUrl: './showcase-auth.component.html',
  styleUrl: './showcase-auth.component.css',
  standalone: true,
})
export class ShowcaseAuthComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  readonly doc = authenticationDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  customConfigLogin = { appState: { target: '/search/authentication' } };
  customConfigLogout = { logoutParams: { returnTo: document.location.origin } };

  @ViewChild('tplBasic') tplBasic!: TemplateRef<void>;
  @ViewChild('tplCustomRedirect') tplCustomRedirect!: TemplateRef<void>;

  ngAfterViewInit(): void {
    this.demoTemplates = new Map([
      ['basic', this.tplBasic],
      ['custom-redirect', this.tplCustomRedirect],
    ]);
    this.cdr.detectChanges();
  }
}
