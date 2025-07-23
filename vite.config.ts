import react from '@vitejs/plugin-react';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: '/',
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
    target: 'es2015', // Совместимо с большинством браузеров
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});