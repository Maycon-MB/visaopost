import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  base: isProd ? '/visaopost/dilorenzo' : '/',
  trailingSlash: 'always',
});
