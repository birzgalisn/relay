import { MantineProvider, mergeMantineTheme, type MantineProviderProps } from '@mantine/core';

import '@mantine/core/styles.css';
import { useMemo } from 'react';

import { defaultUiTheme } from './default-theme';

export type UiProviderProps = MantineProviderProps;

export function UiProvider({ children, theme, ...props }: UiProviderProps) {
  const mergedTheme = useMemo(
    () => (theme ? mergeMantineTheme(defaultUiTheme, theme) : defaultUiTheme),
    [theme],
  );

  return (
    <MantineProvider theme={mergedTheme} defaultColorScheme="auto" {...props}>
      {children}
    </MantineProvider>
  );
}
