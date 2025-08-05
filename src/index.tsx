import React from 'react';
import ReactDOM from 'react-dom';
import App from './App_preact_signals'; 

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootEl
  );
}
