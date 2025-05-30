import { segmentGroupAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const segmentToggleGroupSlotRecipe = defineSlotRecipe({
  className: 'segmentToggleGroup',
  slots: segmentGroupAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'accent',
      display: 'flex',
      width: 'fit-content',
      padding: '4px',
      borderRadius: '6px',
      border: 'solid 0.72px rgba(255, 255, 255, 0.15)',
      flexDirection: {
        _horizontal: 'row',
        _vertical: 'column',
      },
    },
    indicator: {
      borderColor: 'colorPalette.default',
      backgroundColor: 'bg.subtle',
      zIndex: 1,
      borderRadius: '4px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      height: 'var(--height)',
      width: 'var(--width)',
    },
    item: {
      color: 'white',
      cursor: 'pointer',
      fontWeight: 'medium',
      fontSize: '12px',
      transitionDuration: 'normal',
      transitionProperty: 'color',
      transitionTimingFunction: 'default',
      display: 'flex',
      zIndex: '2',
      px: '20px',
      py: '1.5',
      _hover: {
        color: 'quizard.black',
      },
      _checked: {
        fontWeight: 'semibold',
        color: 'quizard.black',
        _hover: {
          color: 'quizard.black',
        },
      },
      _disabled: {
        color: 'fg.disabled',
        cursor: 'not-allowed',
        _hover: {
          color: 'fg.disabled',
        },
      },
    },
  },
});
