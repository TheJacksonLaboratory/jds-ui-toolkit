import {MenubarDesignTokens} from '@primeng/themes/types/menubar';

export const menubar: MenubarDesignTokens = {
  root: {
    borderRadius: '0px'
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.400}',
        color: '{surface.0}'
      },
      item: {
        color: '{surface.0}'
      },
      submenu: {
        background: '{surface.0}',
        padding: '.5rem 1rem'
      },
      submenuIcon: {
        color: '{surface.400}'
      }
    }
  },
  css: () => `
        .p-menubar-submenu .p-menubar-item-content {
          color: black;
          font-weight: normal;
        }
        
        p-menubarsub {
          margin: auto;
        }
        
        .p-menubar-root-list {
          font-weight: bold;
        }
    `
}
