import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { TeamProvider } from './context/TeamContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TeamProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </TeamProvider>
    </HashRouter>
  </StrictMode>,
)
