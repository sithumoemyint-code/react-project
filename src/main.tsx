import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import App from './App.tsx'

const CHUNK_RELOAD_KEY = 'mytel-cms-chunk-reload'
const CHUNK_RELOAD_COOLDOWN_MS = 10_000

// A new deploy removes old hashed chunks; reload to pick up the current build.
// The time guard stops a reload loop if a chunk is permanently missing.
window.addEventListener('vite:preloadError', () => {
  const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY))
  if (Date.now() - lastReload < CHUNK_RELOAD_COOLDOWN_MS) return
  sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster richColors position="top-right" />
  </StrictMode>,
)
