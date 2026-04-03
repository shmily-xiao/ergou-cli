import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    cli: 'src/commands.ts',
    // index: 'src/index.ts', // 暂时禁用，有复杂依赖
  },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  external: ['react', 'ink', 'bidi-js', 'usehooks-ts', 'supports-hyperlinks'],
  alias: {
    'bun:bundle': './src/bun-bundle.ts',
  },
  minify: false,
  target: 'node20',
  outDir: 'dist',
  env: {
    NODE_ENV: 'production',
  },
});
