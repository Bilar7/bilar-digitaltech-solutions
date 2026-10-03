import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5530,
    strictPort: true,
    host: 'localhost',
    hmr: true,
  },
});
