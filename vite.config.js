import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// Two entries: index.html (landing + dashboard + embed-builder SPA) and
// embed.html (lean, chrome-less widget loaded inside iframes).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        embed: 'embed.html',
      },
    },
  },
})
