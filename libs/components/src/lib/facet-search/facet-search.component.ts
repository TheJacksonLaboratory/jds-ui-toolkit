import { Component, computed, ElementRef, input, Input, OnInit, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// PrimeNG modules
import { ButtonModule} from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ListboxModule } from 'primeng/listbox';
// models
import { IFacetSearchConfig, IFacetSearchCategory, IFacetOption, IAppliedSearchChip } from './facet-search.model';
// services
import { FacetSearchFacade } from './facet-search.facade';

@Component({
  selector: 'lib-facet-search',
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    ChipModule,
    DividerModule,
    DrawerModule,
    FormsModule,
    ListboxModule
  ],
  templateUrl: './facet-search.component.html',
  styleUrl: './facet-search.component.css',
  standalone: true
})
export class FacetSearchComponent implements OnInit {
  // categories input signal
  categories = input<IFacetSearchCategory[]>([]);

  // errors input signal
  errors = input<string[]>([]);

  // default facet search configuration
  @Input() config: IFacetSearchConfig = {
    isToggable: false,
    isVisible: false
  };

  // facet search containing element (<div> is recommended)
  @Input() parentContainer!: ElementRef<HTMLElement> | HTMLElement;

  private facetSearchFacade = inject(FacetSearchFacade);

  constructor() {
    effect(() => {
      const currentCategories = this.categories();

      if(currentCategories && currentCategories.length > 0) {
        this.facetSearchFacade.setSearchCategories(currentCategories);
      }
    });
  }

  /**
   * onInit lifecycle hook: deals with loading the component's initial state
   * especially in more complicated scenarios - currently, this is not needed.
   */
  ngOnInit() {
    // when the component initializes, synchronize its internal state with the
    // signal's current value - this handles scenarios where the signal might
    // have a value from a previous state/interaction
    // this.appliedSearches = { ...this.facetSearchSignals.appliedSearches$()};
    console.log("FacetSearchComponent initialized with categories");
  }

  get isSearchVisible() {
    return this.facetSearchFacade.getIsSearchVisible$();
  }

  get containingElement(): HTMLElement {
    return this.parentContainer instanceof ElementRef
      ? this.parentContainer.nativeElement
      : this.parentContainer;
  }

  /**
   * Computed property that returns the applied search chips based on the
   * current applied searches. Maps the applied searches to chips, grouping the
   * options by search category.
   */
  appliedSearchesChips = computed<IAppliedSearchChip[]>(() => {
    // on updates to the applied searches signal, recompute the applied searches chips
    const appliedSearches = this.facetSearchFacade.getAppliedSearches$()();

    return Object.entries(appliedSearches).map(([categoryName, optionIds]) => {
      const category: IFacetSearchCategory | undefined = this.categories().find(cat => cat.name === categoryName);

      // convert selected option IDs to option labels
      const optionLabels: string[] = optionIds.map((optionId: string) => {
        const option = category?.options.find(opt => opt.id == optionId);
        return option?.label || optionId;
      });

      // create a single chip with all options in that category
      return {
        id: `${categoryName}-${optionIds.join('-')}`,
        label: `${category?.label || categoryName}: ${optionLabels.join(', ')}`,
        categoryName: categoryName,
        optionValues: optionIds.join(',')
      } as IAppliedSearchChip;
    });
  });

  /**
   * Hides the facet search drawer.
   */
  onCloseFacetSearch() {
    this.facetSearchFacade.setIsSearchVisible(false);
  }


  /**
   * Handles filtering options in a facet search category based on the user's input.
   * @param category
   * @param event
   */
  onFilterOptions(category: IFacetSearchCategory, event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    // filter options here
  }


  /**
   * Handles facet search option's selection/deselection and updates the applied
   * searches state accordingly. The method is called upon checkbox toggle.
   * @param category - facet category containing the selected option
   * @param option - facet option being toggled on/off
   * @param event - checkbox selection event containing selection state
   */
  onOptionChange(category: IFacetSearchCategory, option: IFacetOption, event: any ): void {
    // prevent checking options with zero count (disabled options cannot be checked)
    if(option.count === 0 && event.checked) {
      event.checked = false; // reset the event state
      option.selected = false;
      return;
    }

    const appliedSearches = { ...this.facetSearchFacade.getAppliedSearches$()() };

    // toggle selection state
    option.selected = !option.selected;

    if(option.selected) {
      // ensure the option's category exists (in case not already present)
      if(!appliedSearches[category.name]) {
        appliedSearches[category.name] = [];
      }

      // add this option's id to the applied searches
      if(!appliedSearches[category.name].includes(option.id)) {
        appliedSearches[category.name].push(option.id);
      }
    } else {
      // remove this option's id from the applied searches
      const index = appliedSearches[category.name].indexOf(option.id);
      if(index !== -1) {
        appliedSearches[category.name].splice(index, 1);
      }
      // no options are selected in this category, so remove that category from applied searches
      if(appliedSearches[category.name].length === 0) {
        delete appliedSearches[category.name];
      }
    }

    // update applied searches signal's state
    this.facetSearchFacade.setAppliedSearches(appliedSearches);
  }

  /**
   * Handles removing an applied search chip and updates the applied searches state.
   * @param chipToRemove - the chip to be removed from the applied searches
   */
  onRemoveAppliedSearchChip(chipToRemove: IAppliedSearchChip): void {
    const appliedSearches = { ...this.facetSearchFacade.getAppliedSearches$()() };

    if(appliedSearches[chipToRemove.categoryName]) {
      // since each chip represents an entire category, remove the whole category
      delete appliedSearches[chipToRemove.categoryName];
    }

    // update the applied searches signal with the new state
    this.facetSearchFacade.setAppliedSearches(appliedSearches);

    // uncheck all checkboxes in this category
    chipToRemove.optionValues.split(',').forEach(optionId => {
       const isRemoved = this.updateFacetSearchCheckbox(chipToRemove.categoryName, optionId, false);
    });
  }

  onToggleCategory(category: any): void {
    category.isOpen = !category.isOpen;
  }

  /**
   * Tracks the option by its ID for efficient rendering in ngFor loops.
   */
  trackOptionById(index: number, option: IFacetOption): string {
    return option.id;
  }

  /**
   * Tracks  chip by its ID for efficient ngFor loop rendering.
   * @param index - chip index in the chip array
   * @param chip - the chip to track
   */
  trackByChipId(index: number, chip: IAppliedSearchChip): string {
    return chip.id; // Assuming `id` is unique for each chip
  }

  /**
   * Returns the number of visible options in a facet search category - options
   * with zero count are not counted unless the category's showZeroCount property
   * is set to be true.
   * @param category - the facet search category to count options
   */
  getVisibleOptionCount(category: IFacetSearchCategory): number {
    if(category.showZeroCount) {
      return category.options.length;
    }
    return category.options.filter(option => option.count > 0).length;
  }


  /**
   * Updates checkbox state given a category name and an option ID.
   * @param categoryName - the name of the category containing the option
   * @param optionId - the ID of the option to update
   * @param checked - whether the checkbox is checked or not
   * @return true if the checkbox was successfully updated, false otherwise
   * @private
   */
  private updateFacetSearchCheckbox(categoryName: string, optionId: string, checked: boolean): boolean {
    const category = this.categories().find(
      cat => cat.name === categoryName
    );
    if(!category) return false;

    const option = category.options.find(
      opt => opt.id === optionId
    );
    if(!option) return false;

    option.selected = checked;
    return true;
  }


  /*
   * Returns the value options (key-value pairs) for a given category.
   */
  getOptionsForCategory(category: IFacetSearchCategory): IFacetOption[] {
    return category.options;
  }
}
