import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';
import { components } from './components';
import { primitive } from './primitive';
import { semantic } from './semantic';

const JdsPreset = definePreset(Lara, {
  primitive: primitive,
  semantic: semantic,
  components: components,
},
  `
  :root {
    --submenu-text-color: #fffff;
  }

  .p-menubar-submenu .p-menubar-item-content {
    color: black;
    }
   `
);

export {JdsPreset};
