import { Component, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';
import { ButtonModule } from 'primeng/button';
import { ComponentDoc } from '@jax-data-science/component-docs';

@Component({
  selector: 'app-doc-variations',
  imports: [NgTemplateOutlet, HighlightModule, ButtonModule],
  templateUrl: './doc-variations.component.html',
  standalone: true,
})
export class DocVariationsComponent {
  @Input() doc!: ComponentDoc;
  @Input() demoTemplates!: Map<string, TemplateRef<void>>;

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
  }

  getTemplate(id: string): TemplateRef<void> | null {
    return this.demoTemplates?.get(id) ?? null;
  }
}
