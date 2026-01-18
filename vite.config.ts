import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src/web',
  publicDir: '../../public',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/web'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
