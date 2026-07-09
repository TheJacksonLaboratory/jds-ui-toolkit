import { Component } from '@angular/core';
import contributingAComponentMarkdown from '@repo-docs/contributing-a-component.md?raw';
import { MarkdownDocComponent } from '../markdown-doc/markdown-doc.component';

@Component({
  selector: 'app-creating-a-component',
  imports: [MarkdownDocComponent],
  template: `<app-markdown-doc [markdown]="markdown"></app-markdown-doc>`,
  standalone: true,
})
export class CreatingAComponentComponent {
  readonly markdown = contributingAComponentMarkdown;
}
