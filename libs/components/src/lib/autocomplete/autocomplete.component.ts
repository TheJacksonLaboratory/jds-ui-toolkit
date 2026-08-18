import { Component, ViewEncapsulation, computed, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import type { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { JdsAutocompleteGroup, JdsAutocompleteItem } from './autocomplete.model';

const MAX_PER_GROUP = 4;
const MAX_TOTAL_ITEMS = 8;

@Component({
  selector: 'lib-jds-autocomplete',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class JdsAutocompleteComponent {
  /** Two-way bound selected item, or `null` when nothing is chosen. */
  value = model<JdsAutocompleteItem | null>(null);

  /**
   * Suggestions to display. Pass a flat `JdsAutocompleteItem[]` for an ungrouped
   * list, or a `JdsAutocompleteGroup[]` to render section headers. The panel caps
   * display at 4 items per group and 8 items total.
   */
  suggestions = model<JdsAutocompleteGroup[] | JdsAutocompleteItem[]>([]);
  /**
   * Total number of matches available on the server. When non-null, a
   * "Show all N results" footer is rendered and the `showAll` output fires when
   * it is clicked.
   */
  totalCount = model<number | null>(null);

  /** Placeholder text for the input field. */
  placeholder = model('');
  /** Disables the input when true. */
  disabled = model(false);
  /** Minimum number of characters typed before `completeMethod` fires. */
  minLength = model(2);
  /** Debounce in milliseconds between keystroke and `completeMethod`. */
  delay = model(250);
  /** Max height of the suggestions panel before it scrolls (CSS length). */
  scrollHeight = model('400px');
  /** Target the overlay panel is appended to; defaults to `body`. */
  appendTo = model<string | HTMLElement>('body');
  /** Requires the typed value to match a suggestion, clearing it otherwise. */
  forceSelection = model(false);
  /** Shows a dropdown trigger button that opens the panel on click. */
  dropdown = model(false);

  /** Emits the current query when the user types past `minLength`; fetch suggestions here. */
  completeMethod = output<{ query: string }>();
  /** Emits the chosen item when a suggestion is selected. */
  selectItem = output<JdsAutocompleteItem>();
  /** Emits the current query when the "Show all results" footer is clicked. */
  showAll = output<{ query: string }>();
  /** Emits when the input is cleared. */
  cleared = output<void>();

  protected currentQuery = signal('');

  protected isGrouped = computed(() => {
    const s = this.suggestions();
    return s.length > 0 && 'groupLabel' in s[0];
  });

  protected showAllFooter = computed(() => this.totalCount() !== null);

  protected displaySuggestions = computed(() => {
    const s = this.suggestions();
    if (!this.isGrouped()) {
      return (s as JdsAutocompleteItem[]).slice(0, MAX_TOTAL_ITEMS);
    }

    const groups = s as JdsAutocompleteGroup[];
    const taken = new Array(groups.length).fill(0);
    let total = 0;

    while (total < MAX_TOTAL_ITEMS) {
      let addedThisRound = false;
      for (let i = 0; i < groups.length && total < MAX_TOTAL_ITEMS; i++) {
        if (taken[i] < MAX_PER_GROUP && taken[i] < groups[i].items.length) {
          taken[i]++;
          total++;
          addedThisRound = true;
        }
      }
      if (!addedThisRound) break;
    }

    return groups
      .map((group, i) => ({ ...group, items: group.items.slice(0, taken[i]) }))
      .filter((group) => group.items.length > 0);
  });

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
