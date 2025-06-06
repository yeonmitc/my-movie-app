import { createRoot } from 'react-dom/client';
import '@/common/components/global.css';
import App from './App.jsx';
import AppProvider from './providers/AppProvider.jsx';

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <App />
  </AppProvider>
);
