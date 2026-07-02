import { Component, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ComponentDoc } from '@jax-data-science/component-docs';

@Component({
  selector: 'app-doc-variations',
  imports: [NgTemplateOutlet, ButtonModule],
  templateUrl: './doc-variations.component.html',
  standalone: true,
})
export class DocVariationsComponent {
  @Input() doc!: ComponentDoc;
  @Input() demoTemplates!: Map<string, TemplateRef<void>>;

  copied = '';

  copyCode(code: string, id: string): void {
    navigator.clipboard.writeText(code);
    this.copied = id;
    setTimeout(() => {
      if (this.copied === id) this.copied = '';
    }, 2000);
  }

  getTemplate(id: string): TemplateRef<void> | null {
    return this.demoTemplates?.get(id) ?? null;
  }
}
