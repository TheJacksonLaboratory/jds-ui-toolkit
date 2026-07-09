import { Component } from '@angular/core';
import contributingAServiceMarkdown from '@repo-docs/contributing-a-service.md?raw';
import { MarkdownDocComponent } from '../markdown-doc/markdown-doc.component';

@Component({
  selector: 'app-creating-a-service',
  imports: [MarkdownDocComponent],
  template: `<app-markdown-doc [markdown]="markdown"></app-markdown-doc>`,
  standalone: true,
})
export class CreatingAServiceComponent {
  readonly markdown = contributingAServiceMarkdown;
}
