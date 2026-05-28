import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite skill: ESM config with alias for clean imports
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
})
