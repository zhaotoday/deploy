import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['node-ssh', 'chalk', 'ora', 'fs', 'path'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          banner: (chunk) => {
            if (chunk.name === 'cli') {
              return '#!/usr/bin/env node';
            }
            return '';
          },
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          banner: (chunk) => {
            if (chunk.name === 'cli') {
              return '#!/usr/bin/env node';
            }
            return '';
          },
        },
      ],
    },
    target: 'node16',
  },
});