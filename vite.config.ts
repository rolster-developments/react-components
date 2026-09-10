import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const stylesFoundations = resolve(
  import.meta.dirname,
  '../rolster-styles-foundations/scss'
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@rolster\/styles-foundations\/(components|design-system-[a-z]+)$/,
        replacement: `${stylesFoundations}/$1/index.scss`
      },
      {
        find: /^@rolster\/styles-foundations$/,
        replacement: `${stylesFoundations}/styles.scss`
      }
    ]
  },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**']
  }
});
