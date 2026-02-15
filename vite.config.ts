import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Performance optimizations
  build: {
    // Enable CSS minification (uses cssnano)
    cssMinify: true,
    // Use esbuild for minification (default, faster than terser)
    minify: 'esbuild',
    // Rollup options for better chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-helmet-async'],
          framer: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
