import { segmentToggleGroupSlotRecipe } from '@/theme/segment-toggle-group.recipe';
import { Preset, defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';
import { segmentGroup } from 'styled-system/recipes';
import { primary } from '@/theme/primaryPalette';
import amber from '@park-ui/panda-preset/colors/amber';
import sand from '@park-ui/panda-preset/colors/sand';

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  globalCss: {
    em: { fontStyle: 'italic' },
    h1: { fontSize: '1.5em', marginBottom: '0.5em !important', marginTop: '0.5em !important', fontWeight: 'bold' },
    h2: { fontSize: '1.2em', marginBottom: '0.5em !important', marginTop: '0.5em !important', fontWeight: 'bold' },
    h3: { fontSize: '1.1em', marginBottom: '0.5em', marginTop: '0.5em !important', fontWeight: 'bold' },
    h4: { fontSize: '1em', marginBottom: '0.5em', marginTop: '0.5em !important', fontWeight: 'bold' },
    '#chat-message  h5': {
      fontSize: '0.83em',
      marginBottom: '0.5em',
      marginTop: '0.5em !important',
      fontWeight: 'bold',
    },
    h6: { fontSize: '0.67em', marginBottom: '0.5em', marginTop: '0.5em !important', fontWeight: 'bold' },
    p: { marginBottom: '1em' },
    strong: { fontWeight: 'bold' },
    blockquote: {
      fontStyle: 'italic',
      borderLeft: '4px solid #ccc',
      paddingLeft: '16px',
      margin: '1em 0',
    },
    ol: { listStyleType: 'auto', paddingLeft: '2em', marginBottom: '1em' },
    ul: { listStyleType: 'disc', paddingLeft: '2em', marginBottom: '1em' },
    'ul ul, ol ul': { listStyleType: 'circle' },
    'ul ul ul, ol ul ul': { listStyleType: 'square' },
    'ul ul ul ul, ol ul ul ul': { listStyleType: 'disc' },
    code: {
      background: '#ededffbd !important',
    },
    pre: {
      background: '#f4f4f4',
      padding: '10px',
      overflowX: 'auto',
      marginBottom: '1em',
    },
    a: { color: '#007bff', textDecoration: 'none' },
    'a:hover': { textDecoration: 'underline' },
    hr: { border: '0', borderBottom: '1px solid #ccc', margin: '20px 0' },
    img: { maxWidth: '100%', height: 'auto' },
    '.rpv-core__textbox': { fontSize: '1em', textAlign: 'center', height: '100% !important', width: '90% !important' },
    'mjx-container[jax="SVG"][display="true"]': { margin: '0.5rem 0 !important' },
    mark: { backgroundColor: '#e7beff6b !important' },
  },
  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          quizard: {
            black: { value: '#15112B' },
          },
        },
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': {
            backgroundColor: 'black',
          },
          '50%': {
            backgroundColor: 'transparent',
          },
        },
      },
      recipes: {},
      slotRecipes: {
        segmentToggleGroup: segmentToggleGroupSlotRecipe,
        segmentGroup: {
          base: {
            indicator: {
              // TODO: maybe a new recipe for this
              borderColor: 'transparent',
              _horizontal: {
                bottom: 'initial',
                borderBottomWidth: '0',
                transform: 'none',
                backgroundColor: 'bg.subtle',
                zIndex: 1,
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                height: 'var(--height)',
              },
            },
            item: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              paddingBottom: '0.5rem',
              paddingTop: '0.5rem',
              px: '1rem',
              _checked: {
                color: 'quizard.black',
                zIndex: 2,
              },
            },
            root: {
              borderBottomWidth: '0px',
              rounded: 'md',
              padding: '0.25rem',
            },
          },
        },
      },
    },
  },
  jsxFramework: 'react',
  presets: [
    createPreset({
      accentColor: primary,
      radius: 'md',
      grayColor: sand,
    }) as Preset,
  ],

  // The output directory for your css system
  outdir: 'styled-system',
});
