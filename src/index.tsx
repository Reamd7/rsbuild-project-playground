import React from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App_useRefState'; 
import App from './App_preact_signals'; 
// import App from './App_useMemoFn'; 
// import App from './App_useRef'; 

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
