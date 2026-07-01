import { Component, ViewEncapsulation, computed, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import type { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { JdsAutocompleteGroup, JdsAutocompleteItem } from './autocomplete.model';

@Component({
  selector: 'lib-jds-autocomplete',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class JdsAutocompleteComponent {
  // Two-way bindable selected value
  value = model<JdsAutocompleteItem | null>(null);

  // Data
  suggestions = model<JdsAutocompleteGroup[] | JdsAutocompleteItem[]>([]);
  totalCount = model<number | null>(null);

  // PrimeNG pass-through inputs
  placeholder = model('');
  disabled = model(false);
  minLength = model(2);
  delay = model(250);
  scrollHeight = model('400px');
  appendTo = model<string | HTMLElement>('body');
  forceSelection = model(false);
  dropdown = model(false);

  // Outputs
  completeMethod = output<{ query: string }>();
  selectItem = output<JdsAutocompleteItem>();
  showAll = output<{ query: string }>();
  cleared = output<void>();

  protected currentQuery = signal('');

  protected isGrouped = computed(() => {
    const s = this.suggestions();
    return s.length > 0 && 'groupLabel' in s[0];
  });

  protected showAllFooter = computed(() => this.totalCount() !== null);

  onComplete(event: AutoCompleteCompleteEvent): void {
    this.currentQuery.set(event.query);
    this.completeMethod.emit({ query: event.query });
  }

  onSelect(event: AutoCompleteSelectEvent): void {
    this.selectItem.emit(event.value as JdsAutocompleteItem);
  }

  onClear(): void {
    this.cleared.emit();
  }

  onShowAll(): void {
    this.showAll.emit({ query: this.currentQuery() });
  }

  highlightMatch(label: string, query: string): string {
    const escaped = this.escapeHtml(label);
    if (!query) return escaped;
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp(`(${safeQuery})`, 'gi'), '<strong>$1</strong>');
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
