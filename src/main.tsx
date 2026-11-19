import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Carlito: the open twin of Calibri, the font of the course's task sheets.
import '@fontsource/carlito/400.css'
import '@fontsource/carlito/400-italic.css'
import '@fontsource/carlito/700.css'

import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Missing #root element')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
