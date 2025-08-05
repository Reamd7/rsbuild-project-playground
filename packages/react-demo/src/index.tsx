import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App_preact_signals'; 
import { FpsView } from 'react-fps';

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <FpsView />
      <App />
    </React.StrictMode>
  );
}
