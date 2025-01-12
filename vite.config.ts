import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { peerDependencies } from './package.json';
import { resolve } from 'path';
import tailwindcss from "tailwindcss";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'lib';

  return {
    plugins: [
      react(),
      ...(isLibrary
        ? [
          dts({
            tsconfigPath: './tsconfig.build.json',
            outDir: './dist/lib/types',
            insertTypesEntry: true,
            copyDtsFiles: false,
            // Only emit declarations when building library
            beforeWriteFile: (filePath, content) => {
              if (!isLibrary) {
                return false;
              }
              return { filePath, content };
            },
          }),
          libInjectCss(),
        ]
        : []),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    base: "./",
    build: isLibrary
      ? {
        outDir: './dist/lib',
        lib: {
          entry: resolve(__dirname, './index.ts'),
          name: 'DynamicLayouts',
          fileName: (format) => `index.${format}.js`,
          formats: ['cjs', 'es'],
        },
        cssCodeSplit: true,
        rollupOptions: {
          external: [...Object.keys(peerDependencies)],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              tailwindcss: 'tailwindcss',
            },
            assetFileNames: 'index.css',
          },
          preserveModules: false,
        },
        sourcemap: true,
        emptyOutDir: true,
      }
      : {
        outDir: './dist/app',
        assetsDir: 'assets', // Ensures assets go into `dist/app/assets`
        emptyOutDir: true,
      },
  };
});