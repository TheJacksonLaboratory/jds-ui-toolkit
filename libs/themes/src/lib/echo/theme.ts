import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';
import { components } from './components';
import { primitive } from './primitive';
import { semantic } from './semantic';


// Recursively flatten object to CSS variables, omitting 'colorScheme' from variable names but including its subkeys
function toCssVars(obj: Record<string, unknown>, prefix = ''): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      // Omit 'colorScheme' from the variable name, but include its subkeys
      const nextPrefix = key === 'colorScheme' ? prefix : `${prefix}${key}-`;
      if (typeof value === 'object' && value !== null) {
        return toCssVars(value as Record<string, unknown>, nextPrefix);
      }
      // Remove trailing dash for leaf keys
      const varName = nextPrefix.endsWith('-') ? nextPrefix.slice(0, -1) : nextPrefix;
      return `  --${varName}: ${String(value)};`;
    })
    .join('\n');
}

const echoCSSVars = `
:root {
${toCssVars(primitive)}
  --submenu-text-color: #fffff;
  --button-secondary-background: #ffffff;
}
`;

const EchoPreset = definePreset(Lara, {
  primitive: primitive,
  semantic: semantic,
  components: components
}, echoCSSVars);

export {EchoPreset};
