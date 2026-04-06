import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This only affects your LOCAL MacBook development (npm run dev)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // This ensures Vite builds correctly for Vercel
  build: {
    outDir: 'dist',
  }
})