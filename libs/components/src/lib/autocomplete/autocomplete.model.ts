export interface JdsAutocompleteItem {
  id: string;
  label: string;
}

export interface JdsAutocompleteGroup {
  groupLabel: string;
  items: JdsAutocompleteItem[];
}
