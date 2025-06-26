import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';
import { components } from './components';
import { primitive } from './primitive';
import { semantic } from './semantic';

const EchoPreset = definePreset(Lara, {
  primitive: primitive,
  semantic: semantic,
  components: components
},
  `
  :root {
    --submenu-text-color: #fffff;
    --button-secondary-background: #ffffff;
  }
   `
);

export {EchoPreset};
