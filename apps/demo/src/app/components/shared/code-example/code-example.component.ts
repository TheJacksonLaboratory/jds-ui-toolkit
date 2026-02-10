import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-rounded-lg tw-overflow-hidden tw-mb-6 echo-bg-slate-900">
      <div class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 echo-bg-slate-800">
        <span class="tw-text-sm tw-font-medium echo-text-grey-300">{{ title }}</span>
        <button
          (click)="copyCode()"
          class="tw-px-3 tw-py-1 tw-text-xs tw-rounded tw-transition-colors tw-text-white"
          [class.echo-bg-cyan-600]="copied"
          [class.echo-bg-cyan-700]="!copied"
          (mouseenter)="hovered = true"
          (mouseleave)="hovered = false"
          [style.opacity]="hovered && !copied ? '0.9' : '1'">
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <pre class="tw-p-4 tw-overflow-x-auto tw-text-sm"><code class="echo-text-grey-100">{{ code }}</code></pre>
    </div>
  `
})
export class CodeExampleComponent {
  @Input() title = 'Code Example';
  @Input() code = '';
  copied = false;
  hovered = false;

  copyCode() {
    navigator.clipboard.writeText(this.code);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}
