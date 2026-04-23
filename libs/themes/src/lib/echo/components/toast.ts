import { ToastDesignTokens } from '@primeuix/themes/types/toast';

export const toast: ToastDesignTokens = {
  colorScheme: {
    light: {
      root: {
        blur: '2px',
      },
      info: {
        background: '{teal.50}',
        color: '{teal.700}',
      },
      success: {
        background: '{green.700}',
        color: '{green.600}',
      },
      warn: {
        background: '{orange.600}',
        color: '{orange.600}',
      },
      error: {
        background: '{red.500}',
        color: '{red.600}',
      },
    },
  },
};
