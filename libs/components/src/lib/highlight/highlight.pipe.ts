import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

      constructor(private sanitizer: DomSanitizer) {}

      transform(value: string, searchTerm: string, wrapTemplate = '<strong>$&</strong>'): SafeHtml {
        if (!searchTerm || searchTerm === '') {
          return this.sanitizer.bypassSecurityTrustHtml(value);
        }

        const regex = new RegExp(searchTerm, 'gi'); // 'gi' for global and case-insensitive
        // Replace $& in the template with the matched text
        const highlightedText = value.replace(regex, match => wrapTemplate.replace('$&', match));
        return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
      }

}
