export interface PagingLinks {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

export interface Paging {
  page?: number;
  items?: number;
  total_pages?: number;
  total_items?: number;
  links?: PagingLinks;
}
