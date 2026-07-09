import { Component, Input, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

/**
 * Renders a raw markdown string (imported at build time via a `?raw`
 * import) as sanitized HTML. Content is always a file from this
 * repository's own `docs/` folder — never user input — so rendering it as
 * trusted HTML is safe.
 */
@Component({
  selector: 'app-markdown-doc',
  imports: [],
  templateUrl: './markdown-doc.component.html',
  standalone: true,
})
export class MarkdownDocComponent {
  private sanitizer = inject(DomSanitizer);

  private readonly markdownSignal = signal('');

  @Input() set markdown(value: string) {
    this.markdownSignal.set(value);
  }

  readonly html = computed<SafeHtml>(() => {
    const rendered = marked.parse(this.markdownSignal(), { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(rendered);
  });
}
