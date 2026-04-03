import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    cli: 'src/commands.ts',
    // index: 'src/index.ts', // 暂时禁用，ink 有太多外部依赖
  },
  format: ['esm'],
  dts: false, // 暂时跳过类型定义生成，让 CLI 先跑起来
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  external: ['react', 'ink'],
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
