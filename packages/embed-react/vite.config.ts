import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist/embed',
    lib: {
      entry: resolve(__dirname, 'src/embed.ts'),
      name: 'ReviewsUpEmbed',
      fileName: (format) => `embed.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {},
    minify: 'esbuild',
  },
});
