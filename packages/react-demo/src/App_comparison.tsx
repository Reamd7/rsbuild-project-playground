import React, { useState } from 'react';
import { FpsView } from 'react-fps';
import AppPreactSignals from './App_preact_signals';
import AppPreactSignalsOptimized from './App_preact_signals_optimized';
import AppUseRefState from './App_useRefState';
import AppUseRefStateOptimized from './App_useRefState_optimized';

type AppVersion =
  | 'preact-signals'
  | 'preact-optimized'
  | 'useRefState'
  | 'optimized';

const AppComparison = () => {
  const [currentApp, setCurrentApp] = useState<AppVersion>('preact-signals');

  const renderApp = () => {
    switch (currentApp) {
      case 'preact-signals':
        return <AppPreactSignals />;
      case 'preact-optimized':
        return <AppPreactSignalsOptimized />;
      case 'useRefState':
        return <AppUseRefState />;
      case 'optimized':
        return <AppUseRefStateOptimized />;
      default:
        return <AppPreactSignals />;
    }
  };

  return (
    <>
      <FpsView />
      <div
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 10000,
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>性能对比测试</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button
            onClick={() => setCurrentApp('preact-signals')}
            style={{
              padding: '5px 10px',
              backgroundColor:
                currentApp === 'preact-signals' ? '#007acc' : '#f0f0f0',
              color: currentApp === 'preact-signals' ? 'white' : 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Preact Signals (原版)
          </button>
          <button
            onClick={() => setCurrentApp('preact-optimized')}
            style={{
              padding: '5px 10px',
              backgroundColor:
                currentApp === 'preact-optimized' ? '#007acc' : '#f0f0f0',
              color: currentApp === 'preact-optimized' ? 'white' : 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Preact Signals (优化版)
          </button>

          <button
            onClick={() => setCurrentApp('useRefState')}
            style={{
              padding: '5px 10px',
              backgroundColor:
                currentApp === 'useRefState' ? '#007acc' : '#f0f0f0',
              color: currentApp === 'useRefState' ? 'white' : 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            useRefState (原版)
          </button>
          <button
            onClick={() => setCurrentApp('optimized')}
            style={{
              padding: '5px 10px',
              backgroundColor:
                currentApp === 'optimized' ? '#007acc' : '#f0f0f0',
              color: currentApp === 'optimized' ? 'white' : 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            useRefState (优化版)
          </button>
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
          当前: {currentApp}
          <br />
          拖动绿色区域测试性能
          <br />
          观察右上角 FPS 数值
        </div>
      </div>
      {renderApp()}
    </>
  );
};

export default AppComparison;
