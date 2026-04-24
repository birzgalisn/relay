import { defineConfig } from 'tsdown';

const prodBuild = process.env.NODE_ENV === 'production';

export default defineConfig({
  clean: true,
  dts: true,
  sourcemap: !prodBuild,
  format: 'cjs',
  fixedExtension: false,
  platform: 'node',
  tsconfig: './tsconfig.json',
  entry: ['./src/index.ts'],
  unbundle: true,
  exports: false,
  deps: {
    skipNodeModulesBundle: true,
    neverBundle: ['jest', /^@jest\//],
  },
});
