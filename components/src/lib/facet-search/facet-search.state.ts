import { Injectable, signal, Signal } from '@angular/core';
// models
import { IFacetSearchCategory } from './facet-search.model';

@Injectable({
  providedIn: 'root'
})
export class FacetSearchState {
  // private isSearchVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // search categories (and options) state
  private categoriesSignal = signal<IFacetSearchCategory[]>([]);
  public categories$ = this.categoriesSignal.asReadonly();

  // errors signal to hold any errors that might occur
  private errorsSignal = signal<string[]>([]);
  public errors$ = this.errorsSignal.asReadonly();

  // signal to hold the current applied search selections
  private appliedSearchesSignal = signal<Record<string, string[]>>({});
  public appliedSearches$ = this.appliedSearchesSignal.asReadonly();

  // is search visible state
  private isSearchVisibleSignal = signal<boolean>(false);
  public isSearchVisible$ = this.isSearchVisibleSignal.asReadonly();

  // set the visibility of the search component
  setIsSearchVisible(isVisible: boolean): void {
    this.isSearchVisibleSignal.set(isVisible);
  }

  getIsSearchVisible$(): Signal<boolean> {
    return this.isSearchVisible$;
  }

  setSearchCategories(categories: IFacetSearchCategory[]): void {
    this.categoriesSignal.set(categories);
  }

  getSearchCategories$(): Signal<Readonly<IFacetSearchCategory[]>> {
    return this.categories$;
  }

  // set errors state
  setErrors(errors: string[]): void {
    this.errorsSignal.set(errors);
  }

  getErrors$(): Signal<Readonly<string[]>> {
    return this.errors$;
  }

  // applied searches state
  setAppliedSearches(appliedSearches: Record<string, string[]>): void {
    this.appliedSearchesSignal.set(appliedSearches);
  }

  getAppliedSearches$(): Signal<Readonly<Record<string, string[]>>> {
    return this.appliedSearches$;
  }
}