import React from 'react';
import { createRoot } from 'react-dom/client';
import App1 from './App_useRefState'; 
import App2 from './App_preact_signals'; 
import App3 from './App_preact_signals_dom'; 
import App4 from './App_source'; 

function Core() {
  const [selected, setSelected] = React.useState<"preact_signals_dom" | "preact_signals" | "useRefState" | "source">("preact_signals_dom");

  return <div>
      <button onClick={() => setSelected("useRefState")} type='button'>useRefState</button>
      <button onClick={() => setSelected("preact_signals")} type='button'>preact_signals</button>
      <button onClick={() => setSelected("preact_signals_dom")} type='button'>preact_signals_dom</button>
      <button onClick={() => setSelected("source")} type='button'>source</button>
    <div>
      {selected === "useRefState" && <App1 />}
      {selected === "preact_signals" && <App2 />}
      {selected === "preact_signals_dom" && <App3 />}
      {selected === "source" && <App4 />}
    </div>
  </div>;
}

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <Core />
    </React.StrictMode>
  );
}
