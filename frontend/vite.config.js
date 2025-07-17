import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Trendoor/', // 👈 required for GitHub Pages
  plugins: [tailwindcss()],
  server:{port :5174}
})
