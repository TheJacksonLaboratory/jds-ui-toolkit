 export interface IFacetSearchConfig {
  // whether the search is toggable (true) or always visible (false)
  isToggable?: boolean;
  // whether the search is visible by default
  isVisible?: boolean;
}

export interface IFacetOption {
  // facet value unique identifier
  id: string;
  // facet value display label
  label: string;
  // tracks whether specific option is selected
  selected: boolean;
  // items count for this option
  count: number;
}

export type FacetValue = string | number | boolean;

export interface IFacetSearchCategory {
  name: string;
  label?: string;
  isOpen?: boolean;
  showZeroCount?: boolean; // whether to show options with zero count in this category
  options: IFacetOption[];
}

// applied search chip
export interface IAppliedSearchChip {
  id: string;
  label: string; // text on the chip: (e.g., "Status: Running", "Type: Analysis")
  categoryName: string; // chip category name
  optionValues: string;
}