import { Component, Input, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked, Renderer, Tokens } from 'marked';
import { TocContextService, TocHeading } from '../../../getting-started-shell/toc-context.service';

function slugify(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

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
  private tocContext = inject(TocContextService);

  private readonly markdownSignal = signal('');

  readonly html = signal<SafeHtml>('');

  @Input() set markdown(value: string) {
    this.markdownSignal.set(value);
  }

  constructor() {
    // Rendering also needs to report generated heading ids to TocContextService
    // (a side effect on another signal), which computed() forbids — effect()
    // is the correct primitive for "derive + notify" like this.
    effect(() => {
      const seenSlugs = new Map<string, number>();
      const headings: TocHeading[] = [];

      const renderer = new Renderer();
      renderer.heading = ({ text, depth }: Tokens.Heading): string => {
        const id = slugify(text, seenSlugs);
        if (depth <= 2) {
          headings.push({ id, title: text });
        }
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      };

      const marked = new Marked({ renderer });
      const rendered = marked.parse(this.markdownSignal(), { async: false }) as string;

      this.html.set(this.sanitizer.bypassSecurityTrustHtml(rendered));
      this.tocContext.setHeadings(headings);
    });
  }
}
