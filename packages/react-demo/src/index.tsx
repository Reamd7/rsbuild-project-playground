import React from 'react';
import { createRoot } from 'react-dom/client';
import AppComparison from './App_comparison';

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <AppComparison />
    </React.StrictMode>
  );
}
