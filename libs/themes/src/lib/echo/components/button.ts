import { ButtonDesignTokens } from '@primeuix/themes/types/button';

export const button: ButtonDesignTokens = {
  root: {
    gap: '8px',
    sm: {
      paddingX: '8px',
      paddingY: '6px',
    },
    lg: {
      paddingX: '12px',
      paddingY: '8px',
    },
  },
  colorScheme: {
    light: {
      root: {
        secondary: {
          background: '{indigo.400}',
          hoverBackground: '{indigo.600}',
          activeBackground: '{indigo.700}',
          borderColor: '{indigo.400}',
          hoverBorderColor: '{indigo.600}',
          activeBorderColor: '{indigo.700}',
          focusRing: { color: '{indigo.600}' },
        },
        info: {
          background: '{teal.700}',
          hoverBackground: '{teal.800}',
          activeBackground: '{teal.900}',
          borderColor: '{teal.700}',
          hoverBorderColor: '{teal.800}',
          activeBorderColor: '{teal.900}',
          focusRing: { color: '{teal.700}' },
        },
        success: {
          background: '{green.700}',
          hoverBackground: '{green.800}',
          activeBackground: '{green.900}',
          borderColor: '{green.700}',
          hoverBorderColor: '{green.800}',
          activeBorderColor: '{green.900}',
          focusRing: { color: '{green.700}' },
        },
        warn: {
          background: '{orange.600}',
          hoverBackground: '{orange.700}',
          activeBackground: '{orange.800}',
          borderColor: '{orange.600}',
          hoverBorderColor: '{orange.700}',
          activeBorderColor: '{orange.800}',
          focusRing: { color: '{orange.600}' },
        },
        help: {
          background: '{purple.500}',
          hoverBackground: '{purple.600}',
          activeBackground: '{purple.700}',
          borderColor: '{purple.500}',
          hoverBorderColor: '{purple.600}',
          activeBorderColor: '{purple.700}',
          focusRing: { color: '{purple.500}' },
        },
        danger: {
          background: '{red.500}',
          hoverBackground: '{red.600}',
          activeBackground: '{red.700}',
          borderColor: '{red.500}',
          hoverBorderColor: '{red.600}',
          activeBorderColor: '{red.700}',
          focusRing: { color: '{red.500}' },
        },
        contrast: {
          background: '{slate.900}',
          hoverBackground: '{slate.800}',
          activeBackground: '{slate.700}',
          borderColor: '{slate.900}',
          hoverBorderColor: '{slate.800}',
          activeBorderColor: '{slate.700}',
          focusRing: { color: '{slate.900}' },
        },
      },
      outlined: {
        secondary: {
          color: '{indigo.400}',
          hoverBackground: '{indigo.50}',
          activeBackground: '{indigo.100}',
        },
        success: {
          color: '{green.700}',
          hoverBackground: '{green.50}',
          activeBackground: '{green.100}',
        },
        info: {
          color: '{teal.700}',
          hoverBackground: '{teal.50}',
          activeBackground: '{teal.100}',
        },
        warn: {
          color: '{orange.600}',
          hoverBackground: '{orange.50}',
          activeBackground: '{orange.100}',
        },
        help: {
          color: '{purple.500}',
          hoverBackground: '{purple.50}',
          activeBackground: '{purple.100}',
        },
        danger: {
          color: '{red.500}',
          hoverBackground: '{red.50}',
          activeBackground: '{red.100}',
        },
        contrast: {
          color: '{slate.900}',
          hoverBackground: '{slate.50}',
          activeBackground: '{slate.100}',
        },
        plain: {
          color: '{slate.700}',
          hoverBackground: '{slate.50}',
          activeBackground: '{slate.100}',
        },
      },
      text: {
        secondary: {
          hoverBackground: '{indigo.50}',
          activeBackground: '{indigo.100}',
        },
        success: {
          color: '{green.700}',
          hoverBackground: '{green.50}',
          activeBackground: '{green.100}',
        },
        info: {
          color: '{teal.700}',
          hoverBackground: '{teal.50}',
          activeBackground: '{teal.100}',
        },
        warn: {
          color: '{orange.600}',
          hoverBackground: '{orange.50}',
          activeBackground: '{orange.100}',
        },
        help: {
          color: '{purple.500}',
          hoverBackground: '{purple.50}',
          activeBackground: '{purple.100}',
        },
        danger: {
          color: '{red.500}',
          hoverBackground: '{red.50}',
          activeBackground: '{red.100}',
        },
        plain: {
          color: '{slate.900}',
          hoverBackground: '{slate.100}',
          activeBackground: '{slate.200}',
        },
        contrast: {
          color: '{slate.900}',
          hoverBackground: '{slate.50}',
          activeBackground: '{slate.100}',
        },
      },
    },
  },
};
