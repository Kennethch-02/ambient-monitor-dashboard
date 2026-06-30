import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// Client build has two entries: index.html (landing + dashboard + embed-builder SPA) and
// embed.html (lean, chrome-less widget loaded inside iframes). The SSR build (used by
// prerender.js to statically generate each route) uses src/entry-server.jsx instead.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: 'index.html',
            embed: 'embed.html',
          },
        },
      },
}))
