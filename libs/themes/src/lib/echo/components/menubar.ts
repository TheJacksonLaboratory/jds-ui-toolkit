import {MenubarDesignTokens} from '@primeuix/themes/types/menubar';

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
        color: '{surface.0}',
        focusColor: '{gray.300}',
        focusBackground: 'unset'
      },
      submenu: {
        background: '{surface.0}',
        padding: '0 0 .25rem 0'
      }
    }
  },
  css: () => `
  
        .p-menubar {
          height: 64px;
         }
         
        .p-menubar-submenu .p-menubar-item-content {
          color: black;
          font-weight: normal;
        }
        
        p-menubarsub:first-child {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        
        .p-menubar-start, .p-menubar-end {
          flex: 1;
        }
        
        .p-menubar-end {
          justify-content: flex-end;
          display: flex;
        }
        
        .p-menubar-submenu .p-menubar-item-content {
            color: black;
        }
        
        .p-menubar-logo {
          display: flex;
         }
    `
}
