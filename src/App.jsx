import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { EnvironmentProvider } from './context/EnvironmentContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import EmbedBuilder from './pages/EmbedBuilder'

// Three views, all sharing one live data subscription (EnvironmentProvider):
//   /          → Landing  (public front door — also the domain root ambient.teonix.dev)
//   /dashboard → Dashboard (the live app)
//   /embed     → EmbedBuilder (configure + copy an <iframe> snippet)
// The lean embeddable widget itself is a separate Vite entry: embed.html → src/embed.jsx.
const App = () => {
  return (
    <EnvironmentProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/embed" element={<EmbedBuilder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </EnvironmentProvider>
  )
}

export default App
