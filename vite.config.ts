// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { peerDependencies } from './package.json';

const isLibrary = process.env.BUILD_LIB === 'true';

export default defineConfig({
  plugins: [react(), dts()],
  base: isLibrary ? undefined : '/squared-layout/',
  build: isLibrary
    ? {
      outDir: './dist/lib',
        lib: {
          entry: "./index.ts",
          name: 'SquaredLayout',
          fileName: (format) => `index.${format}.js`,
          formats: ["cjs", "es"]
        },
        rollupOptions: {
          external: [...Object.keys(peerDependencies)]
        },
        sourcemap: true,
        emptyOutDir: true,
      }
    : {
        outDir: './dist/app',   
    },
});
