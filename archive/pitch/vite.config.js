import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Output em ../docs/ é o que o GitHub Pages serve (https://maycon-mb.github.io/visaopost/).
// `npm run build` aqui sobrescreve a apresentação publicada — commitar docs/ depois pra publicar.
export default defineConfig({
  plugins: [react()],
  base: '/visaopost/',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
  },
  server: {
    port: 5175,
    strictPort: true,
  },
})
