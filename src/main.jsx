import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { initTheme } from './lib/theme'

initTheme()

const root = document.getElementById('root')
const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Production HTML is prerendered (see prerender.js) → hydrate it. In dev #root is empty → mount.
if (root.firstElementChild) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}
