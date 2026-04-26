import { createTheme, DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';

export const defaultUiTheme = mergeMantineTheme(
  DEFAULT_THEME,
  createTheme({
    fontFamily: `var(--font-geist-sans), ${DEFAULT_THEME.fontFamily}`,
    fontFamilyMonospace: `var(--font-geist-mono), ${DEFAULT_THEME.fontFamilyMonospace}`,
    defaultRadius: 'md',
    headings: {
      ...DEFAULT_THEME.headings,
      fontFamily: `var(--font-geist-sans), ${DEFAULT_THEME.headings.fontFamily}`,
    },
  }),
);
