import type { ImgHTMLAttributes } from 'react';

export type ThemeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  srcLight: string;
  srcDark: string;
};

export function ThemeImage(props: ThemeImageProps) {
  const { srcLight, srcDark, className, alt, width, height, ...rest } = props;
  const w = typeof width === 'number' ? width : undefined;
  const h = typeof height === 'number' ? height : undefined;

  return (
    <>
      <img
        {...rest}
        src={srcLight}
        alt={alt ?? ''}
        width={w}
        height={h}
        className={`imgLight ${className ?? ''}`.trim()}
      />
      <img
        {...rest}
        src={srcDark}
        alt={alt ?? ''}
        width={w}
        height={h}
        className={`imgDark ${className ?? ''}`.trim()}
      />
    </>
  );
}
