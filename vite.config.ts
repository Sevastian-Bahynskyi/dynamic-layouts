// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isLibrary = process.env.BUILD_LIB === 'true';

export default defineConfig({
  plugins: [react()],
  base: isLibrary ? undefined : '/squared-layout/',
  build: isLibrary
    ? {
        outDir: './dist/lib',
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'SquaredLayout',
          fileName: (format) => `squared-layout.${format}.js`,
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
      }
    : {
        outDir: './dist/app',   
    },
});
