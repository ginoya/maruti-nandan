import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep React ecosystem together - this is critical
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separate large libraries
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'pdf-libs': ['html2pdf.js', 'html2canvas'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'ui': ['@radix-ui/react-icons', '@radix-ui/react-popover', '@radix-ui/react-select'],
        },
        // Ensure proper chunk loading order
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
    // Ensure proper module resolution
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Ensure proper module resolution
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
})
