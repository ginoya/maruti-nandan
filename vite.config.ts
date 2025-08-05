import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate large libraries into their own chunks
          if (id.includes('html2pdf.js')) {
            return 'html2pdf';
          }
          if (id.includes('html2canvas')) {
            return 'html2canvas';
          }
          if (id.includes('firebase/app')) {
            return 'firebase-core';
          }
          if (id.includes('firebase/auth')) {
            return 'firebase-auth';
          }
          if (id.includes('firebase/firestore')) {
            return 'firebase-firestore';
          }
          if (id.includes('firebase')) {
            return 'firebase-other';
          }
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
            return 'redux-vendor';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }
          if (id.includes('tailwind')) {
            return 'tailwind-vendor';
          }
          // Default vendor chunk for other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Enable source maps for debugging
    sourcemap: false,
    // Minify CSS
    cssMinify: true,
    // Target modern browsers for better optimization
    target: 'esnext',
    // Enable tree shaking
    minify: 'terser',
  },
})
