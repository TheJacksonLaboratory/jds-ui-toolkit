import { PasswordDesignTokens } from '@primeuix/themes/types/password';

export const password: PasswordDesignTokens = {
  content: {
    gap: '8px',
  },
  colorScheme: {
    light: {
      strength: {
        weakBackground: '{red.400}',
        mediumBackground: '{orange.500}',
        strongBackground: '{green.600}',
      },
    },
  },
};
