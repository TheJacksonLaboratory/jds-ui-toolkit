import { MenuItem } from 'primeng/api';

export interface JdsMenuItem extends MenuItem {
  iconEnd?: boolean;
  items?: JdsMenuItem[];
}
