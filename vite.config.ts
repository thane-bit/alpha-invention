import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the bundle works when served from a GitHub Pages subpath
  // (e.g. https://<user>.github.io/alpha-invention/).
  base: './',
  plugins: [react()],
})
