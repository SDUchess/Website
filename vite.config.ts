import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwind(tailwindConfig),
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
