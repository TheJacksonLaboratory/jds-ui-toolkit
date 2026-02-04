import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-bg-gray-900 tw-rounded-lg tw-overflow-hidden tw-mb-6">
      <div class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-bg-gray-800">
        <span class="tw-text-sm tw-font-medium tw-text-gray-300">{{ title }}</span>
        <button
          (click)="copyCode()"
          class="tw-px-3 tw-py-1 tw-text-xs tw-bg-blue-600 tw-text-white tw-rounded hover:tw-bg-blue-700 tw-transition-colors">
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <pre class="tw-p-4 tw-overflow-x-auto tw-text-sm"><code class="tw-text-gray-100">{{ code }}</code></pre>
    </div>
  `
})
export class CodeExampleComponent {
  @Input() title = 'Code Example';
  @Input() code = '';
  copied = false;

  copyCode() {
    navigator.clipboard.writeText(this.code);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}
