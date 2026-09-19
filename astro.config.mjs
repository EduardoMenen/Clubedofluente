// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Prévia no GitHub Pages: o site é servido dentro de uma subpasta com o
  // nome do repositório, e `base` é o que faz links e assets apontarem certo.
  // Ao trocar por um domínio próprio, apagar `base` e definir
  // `site: 'https://o-dominio.com.br'`.
  base: '/clube_fluente/',

  vite: {
    plugins: [tailwindcss()]
  }
});