import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/shoelace': {
        target: `http://localhost:5173`,
        rewrite: (path) => path.replace(/^\/shoelace/, '/node_modules/@shoelace-style/shoelace')
      }
    }
  }
})
