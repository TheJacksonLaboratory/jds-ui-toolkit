export const semantic = {
  primary: {
    50: '{cyan.50}',
    100: '{cyan.100}',
    200: '{cyan.200}',
    300: '{cyan.300}',
    400: '{cyan.400}',
    500: '{cyan.500}',
    600: '{cyan.600}',
    700: '{cyan.700}',
    800: '{cyan.800}',
    900: '{cyan.900}',
    950: '{cyan.900}', // pinned — no cyan.950 in JDS palette
  },
  formField: {
    paddingX: '12px',
    paddingY: '8px',
    sm: {
      paddingX: '8px',
      paddingY: '6px',
    },
    lg: {
      paddingX: '12px',
      paddingY: '8px',
    },
    borderRadius: '{border.radius.md}',
  },
  list: {
    gap: '8px',
  },
  colorScheme: {
    light: {
      surface: {
        0: '{gray.0}',
        50: '{gray.100}',
        100: '{gray.200}',
        200: '{gray.300}',
        300: '{gray.400}',
        400: '{gray.500}',
        500: '{gray.600}',
        600: '{gray.700}',
        700: '{gray.800}',
        800: '{gray.900}',
        900: '{gray.900}', // pinned — surface.900/950 intentionally same as 800
        950: '{gray.900}', // pinned
      },
      primary: {
        color: '{primary.700}',
        contrastColor: '#ffffff',
        hoverColor: '{primary.800}',
        activeColor: '{primary.900}',
      },
      highlight: {
        background: '{primary.50}',
        focusBackground: '{primary.100}',
        color: '{primary.700}',
        focusColor: '{primary.800}',
      },
      mask: {
        background: 'rgba(0,0,0,0.4)',
      },
      formField: {
        background: '{surface.0}',
        disabledBackground: '{surface.100}',
        filledBackground: '{surface.50}',
        filledHoverBackground: '{surface.50}',
        filledFocusBackground: '{surface.50}',
        borderColor: '{surface.500}',
        hoverBorderColor: '{surface.700}',
        focusBorderColor: '{primary.color}',
        invalidBorderColor: '{red.400}',
        color: '{surface.700}',
        disabledColor: '{surface.500}',
        placeholderColor: '{surface.500}',
        invalidPlaceholderColor: '{red.600}',
        floatLabelColor: '{surface.600}',
        floatLabelFocusColor: '{surface.600}',
        floatLabelActiveColor: '{surface.600}',
        iconColor: '{surface.500}',
        shadow: 'none',
      },
      text: {
        color: '{surface.800}',
        hoverColor: '{gray.1000}',
        mutedColor: '{surface.600}',
        hoverMutedColor: '{surface.600}',
      },
      content: {
        background: '{surface.0}',
        hoverBackground: '{surface.100}',
        borderColor: '{surface.200}',
        color: '{text.color}',
        hoverColor: '{text.hover.color}',
      },
      overlay: {
        select: {
          background: '{surface.0}',
          borderColor: '{surface.500}',
          color: '{text.color}',
        },
        popover: {
          background: '{surface.0}',
          borderColor: '{surface.500}',
          color: '{text.color}',
        },
        modal: {
          background: '{surface.0}',
          borderColor: '{surface.500}',
          color: '{text.color}',
        },
      },
      list: {
        option: {
          focusBackground: '{cyan.700}',
          selectedBackground: '{highlight.background}',
          selectedFocusBackground: '{highlight.focus.background}',
          color: '{text.color}',
          focusColor: '{surface.0}',
          selectedColor: '{highlight.color}',
          selectedFocusColor: '{highlight.focus.color}',
          icon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
          },
        },
        optionGroup: {
          background: 'transparent',
          color: '{text.muted.color}',
        },
      },
      navigation: {
        item: {
          focusBackground: '{surface.100}',
          activeBackground: '{surface.100}',
          color: '{text.color}',
          focusColor: '{text.hover.color}',
          activeColor: '{text.hover.color}',
          icon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
            activeColor: '{surface.500}',
          },
        },
        submenuLabel: {
          background: 'transparent',
          color: '{text.muted.color}',
        },
        submenuIcon: {
          color: '{surface.400}',
          focusColor: '{surface.500}',
          activeColor: '{surface.500}',
        },
      },
    },
    // dark: not implemented — falls back to Aura defaults
  },
};
