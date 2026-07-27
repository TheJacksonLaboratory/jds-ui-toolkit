import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-copy-section-link',
  imports: [],
  standalone: true,
  template: `
    <button
      type="button"
      class="tw-bg-transparent tw-border-none tw-cursor-pointer tw-p-0 tw-text-gray-400 hover:tw-text-blue-600 tw-transition-colors"
      [attr.aria-label]="copied() ? 'Link copied' : 'Copy link to section'"
      (click)="copyLink()">
      <i class="pi tw-text-sm" [class.pi-link]="!copied()" [class.pi-check]="copied()"></i>
    </button>
  `,
})
export class CopySectionLinkComponent {
  @Input() sectionId!: string;

  copied = signal(false);

  copyLink(): void {
    const url = `${location.origin}${location.pathname}#${this.sectionId}`;
    navigator.clipboard.writeText(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
