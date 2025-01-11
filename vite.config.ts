// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { peerDependencies } from './package.json';
import { resolve } from 'path';
import tailwindcss from "tailwindcss";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const isLibrary = process.env.BUILD_LIB === 'true';

export default defineConfig({
  plugins: [react(), 
    dts({
      tsconfigPath: './tsconfig.app.json',
      outDir: './dist/lib',
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
    libInjectCss()
],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  base: isLibrary ? undefined : '/dynamic-layouts/',
  build: isLibrary
    ? {
      outDir: './dist/lib',
        lib: {
          entry: resolve(__dirname, './index.ts'),
          name: 'SquaredLayout',  
          fileName: (format) => `index.${format}.js`,
          formats: ["cjs", "es"]
        },
        cssCodeSplit: true,
        rollupOptions: {
          external: [...Object.keys(peerDependencies)],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              tailwindcss: "tailwindcss",
              assetFileNames: './index.css'
            },
            preserveModules: false
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      }
    : {
        outDir: './dist/app',   
    },
});