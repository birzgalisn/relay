import { Image, useComputedColorScheme } from '@repo/ui';
import type { ImgHTMLAttributes } from 'react';

export type ThemeImageProps = {
  srcLight: string;
  srcDark: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export function ThemeImage({ srcLight, srcDark, ...rest }: ThemeImageProps) {
  const colorScheme = useComputedColorScheme('light');
  const src = colorScheme === 'dark' ? srcDark : srcLight;

  return <Image src={src} {...rest} />;
}
