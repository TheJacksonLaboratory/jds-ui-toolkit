import { Injectable, Signal } from '@angular/core';
// states
import { FacetSearchState } from './facet-search.state';
// models
import { IFacetSearchCategory } from './facet-search.model';

@Injectable({
  providedIn: 'root'
})
export class FacetSearchFacade {

  constructor(
    private state: FacetSearchState
  ) { }

  setIsSearchVisible(isVisible: boolean): void {
    this.state.setIsSearchVisible(isVisible);
  }

  getIsSearchVisible$(): Signal<boolean> {
    return this.state.getIsSearchVisible$();
  }

  setSearchCategories(categories: IFacetSearchCategory[]): void {
    // update the state with the new categories
    this.state.setSearchCategories(categories);

    // also update the applied searches to ensure they are in sync with the categories
    this.syncAppliedSearchesWithCategories();
  }

  getSearchCategories(): Signal<Readonly<IFacetSearchCategory[]>> {
    return this.state.getSearchCategories$();
  }

  /**
   * Sets the errors state.
   * @param errors - An array of error messages to set.
   */
  setErrors(errors: string[]): void {
    // logic here will be added to validate the errors before setting them

    this.state.setErrors(errors);
  }

  /**
   * Gets the errors signal.
   * @returns A signal containing the current errors.
   */
  getErrors$(): Signal<Readonly<string[]>> {
    return this.state.getErrors$();
  }

  /**
   * Synchronizes the applied searches with the current categories.
   */
  syncAppliedSearchesWithCategories(): void {
    const categories = this.state.getSearchCategories$()();
    const appliedSearches: Record<string, string[]> = {};

    categories.forEach(category => {
      const checkedOptions: string[] = [];

      category.options?.forEach(option => {
        // if the option is checked, add it to the checked options array
        if(option.selected) {
          checkedOptions.push(option.id);
        }
      });

      checkedOptions.length && (appliedSearches[category.name] = checkedOptions);
    });

    this.state.setAppliedSearches(appliedSearches);
  }

  setAppliedSearches(appliedSearches: Record<string, string[]>): void {
    this.state.setAppliedSearches(appliedSearches);
  }

  getAppliedSearches$(): Signal<Readonly<Record<string, string[]>>> {
    return this.state.getAppliedSearches$();
  }
}