import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // AÑADE ESTA SECCIÓN PARA PRODUCCIÓN
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactiva sourcemaps en producción
    minify: 'terser', // Minificación agresiva
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // PARA PREVENIR PROBLEMAS DE RUTAS
  base: '/', // Asegura rutas absolutas correctas
  server: {
    port: 3000,
  },
});