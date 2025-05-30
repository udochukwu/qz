import { defineSemanticTokens } from '@pandacss/dev';

export const semanticTokens = defineSemanticTokens({
  animations: {
    'accordion-down': { value: 'accordion-down 0.2s ease-out' },
    'accordion-up': { value: 'accordion-up 0.2s ease-out' },
  },
  borders: {
    base: { value: '1px solid {colors.border}' },
    destructive: { value: '1px solid {colors.destructive}' },
    input: { value: '1px solid {colors.input}' },
    primary: { value: '1px solid {colors.primary}' },
  },
  colors: {
    accent: {
      DEFAULT: {
        value: {
          base: '{colors.primary.500}',
        },
      },
      foreground: {
        value: {
          base: 'white',
        },
      },
    },
    background: {
      value: {
        base: 'white',
      },
    },
    border: {
      value: {
        base: '1px solid {colors.black.100}',
      },
    },
    card: {
      DEFAULT: {
        value: {
          _dark: '{colors.grayscale.950}',
          base: '{colors.grayscale.50}',
        },
      },
      foreground: {
        value: {
          _dark: '{colors.grayscale.50}',
          base: '{colors.grayscale.950}',
        },
      },
    },
    destructive: {
      DEFAULT: {
        value: {
          _dark: '{colors.red.700}',
          base: '{colors.red.500}',
        },
      },
      foreground: {
        value: {
          _dark: '{colors.red.50}',
          base: '{colors.grayscale.50}',
        },
      },
    },
    foreground: {
      value: {
        _dark: '{colors.grayscale.50}',
        base: '{colors.grayscale.950}',
      },
    },
    input: {
      value: {
        _dark: '{colors.grayscale.800}',
        base: '{colors.grayscale.200}',
      },
    },
    muted: {
      DEFAULT: {
        value: {
          base: 'white',
        },
      },
      foreground: {
        value: {
          base: '{colors.black.950}',
        },
      },
    },
    popover: {
      DEFAULT: {
        value: {
          base: 'white',
        },
      },
      foreground: {
        value: {
          base: '{colors.black.950}',
        },
      },
    },
    primary: {
      DEFAULT: {
        value: {
          base: '{colors.primary.500}',
        },
      },
      foreground: {
        value: {
          base: '{colors.white}',
        },
      },
    },
    ring: {
      value: {
        base: '{colors.primary.100}',
      },
    },
    secondary: {
      DEFAULT: {
        value: {
          base: '{colors.primary.100}',
        },
      },
      foreground: {
        value: {
          base: '{colors.white}',
        },
      },
    },
  },
});
