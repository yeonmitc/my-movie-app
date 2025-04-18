
import { createRoot } from 'react-dom/client'
import '@/styles/App.css' 
import '@/styles/header.css'
import '@/styles/notfound.css'
import App from './App.jsx'
import AppProvider from './providers/AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <App />
  </AppProvider>
)
