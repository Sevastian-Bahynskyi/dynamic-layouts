// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

const isLibrary = process.env.BUILD_LIB === 'true';

export default defineConfig({
  plugins: [react(), dts()],
  base: isLibrary ? undefined : '/squared-layout/',
  build: isLibrary
    ? {
        outDir: './dist/lib',
        lib: {
          entry: path.resolve(__dirname, 'index.ts'),
          name: 'SquaredLayout',
          fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      }
    : {
        outDir: './dist/app',   
    },
});
