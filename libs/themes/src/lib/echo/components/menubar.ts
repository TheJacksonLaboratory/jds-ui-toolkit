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
        focusBackground: '{surface.0}',
        focusColor: '{surface.800}'
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
        
        /* White background (submenu dropdowns): use primary cyan 700 on hover */
        .p-menubar-submenu .p-menubar-item.p-focus > .p-menubar-item-content,
        .p-menubar-submenu .p-menubar-item-content:hover {
          background: var(--cyan-700);
          color: var(--gray-0);
        }
        
        .p-menubar-logo {
          display: flex;
         }
    `
}
