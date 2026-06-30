import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { EnvironmentProvider } from './context/EnvironmentContext'
import EmbedWidget from './components/EmbedWidget'
import { applyEmbedTheme } from './lib/theme'

// Lean, chrome-less widget entry (loaded inside an <iframe>). Configured by URL params:
//   ?widget=temperature|humidity|light|motion|summary|all  &theme=light|dark|auto
//   &range=live|1h|24h  &bg=transparent|solid
const params = new URLSearchParams(window.location.search)
const cfg = {
  widget: params.get('widget') || 'temperature',
  theme: params.get('theme') || 'auto',
  range: params.get('range') || '1h',
  bg: params.get('bg') || 'transparent',
}

applyEmbedTheme(cfg.theme)
if (cfg.bg === 'transparent') {
  document.documentElement.style.background = 'transparent'
  document.body.style.background = 'transparent'
}

ReactDOM.createRoot(document.getElementById('embed')).render(
  <React.StrictMode>
    <EnvironmentProvider>
      <EmbedWidget {...cfg} />
    </EnvironmentProvider>
  </React.StrictMode>,
)
