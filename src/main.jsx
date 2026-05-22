import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { register } from './serviceWorkerRegistration.js';

// If you need supabase globally, import it properly:
import { supabase } from './supabaseClient.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

register();
