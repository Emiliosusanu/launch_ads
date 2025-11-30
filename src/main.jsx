
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import customSupabaseClient from '@/lib/customSupabaseClient';

// Expose Supabase client to the window for debugging, if needed.
window.supabase = customSupabaseClient;

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
