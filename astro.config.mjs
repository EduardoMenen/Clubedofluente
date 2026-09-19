// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Domínio final do site — usado pelo Astro para montar URLs absolutas.
  // No GitHub Pages ele é servido na raiz do domínio, então não há `base`.
  site: 'https://clubedofluente.com.br',

  vite: {
    plugins: [tailwindcss()]
  }
});