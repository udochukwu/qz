import { defineSemanticTokens, defineTokens } from '@pandacss/dev';
export const primary = {
  name: 'primary',
  tokens: defineTokens.colors({
    light: {
      '1': { value: '#fdfdff' },
      '2': { value: '#f7f8ff' },
      '3': { value: '#f0f1ff' },
      '4': { value: '#e4e6ff' },
      '5': { value: '#d8dbff' },
      '6': { value: '#c9ccff' },
      '7': { value: '#b5b7ff' },
      '8': { value: '#9b99ff' },
      '9': { value: '#6d56fa' },
      '10': { value: '#614be2' },
      '11': { value: '#5c45db' },
      '12': { value: '#2c226d' },
    },
    dark: {
      '1': { value: '#0f0f1d' },
      '2': { value: '#151528' },
      '3': { value: '#221e4f' },
      '4': { value: '#2d226f' },
      '5': { value: '#362b80' },
      '6': { value: '#3f368e' },
      '7': { value: '#4c43a4' },
      '8': { value: '#5b50c4' },
      '9': { value: '#6d56fa' },
      '10': { value: '#6157cb' },
      '11': { value: '#a9aaff' },
      '12': { value: '#dddfff' },
    },
  }),

  semanticTokens: defineSemanticTokens.colors({
    '1': { value: { _light: '{colors.primary.light.1}', _dark: '{colors.primary.dark.1}' } },
    '2': { value: { _light: '{colors.primary.light.2}', _dark: '{colors.primary.dark.2}' } },
    '3': { value: { _light: '{colors.primary.light.3}', _dark: '{colors.primary.dark.3}' } },
    '4': { value: { _light: '{colors.primary.light.4}', _dark: '{colors.primary.dark.4}' } },
    '5': { value: { _light: '{colors.primary.light.5}', _dark: '{colors.primary.dark.5}' } },
    '6': { value: { _light: '{colors.primary.light.6}', _dark: '{colors.primary.dark.6}' } },
    '7': { value: { _light: '{colors.primary.light.7}', _dark: '{colors.primary.dark.7}' } },
    '8': { value: { _light: '{colors.primary.light.8}', _dark: '{colors.primary.dark.8}' } },
    '9': { value: { _light: '{colors.primary.light.9}', _dark: '{colors.primary.dark.9}' } },
    '10': { value: { _light: '{colors.primary.light.10}', _dark: '{colors.primary.dark.10}' } },
    '11': { value: { _light: '{colors.primary.light.11}', _dark: '{colors.primary.dark.11}' } },
    '12': { value: { _light: '{colors.primary.light.12}', _dark: '{colors.primary.dark.12}' } },

    default: {
      value: {
        _light: '{colors.primary.light.9}',
        _dark: '{colors.primary.dark.9}',
      },
    },
    emphasized: {
      value: {
        _light: '{colors.primary.light.10}',
        _dark: '{colors.primary.dark.10}',
      },
    },
    fg: {
      value: {
        _light: 'white',
        _dark: 'white',
      },
    },
    text: {
      value: {
        _light: '{colors.primary.light.11}',
        _dark: '{colors.primary.dark.11}',
      },
    },
  }),
};
