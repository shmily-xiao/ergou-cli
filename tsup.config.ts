import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    cli: 'src/cli.ts',
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: false, // 暂时跳过类型定义生成，让 CLI 先跑起来
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  external: ['react', 'ink'],
  minify: false,
  target: 'node20',
  outDir: 'dist',
  env: {
    NODE_ENV: 'production',
  },
});
