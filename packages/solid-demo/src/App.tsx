import './App.css';
import { createSignal } from 'solid-js';
import FpsView from './FpsView';
import NormalApp from './NormalApp';
import OptimizedApp from './OptimizedApp';

type AppVersion = 'normal' | 'optimized';

const App = () => {
  const [currentApp, setCurrentApp] = createSignal<AppVersion>('normal');

  const renderApp = () => {
    switch (currentApp()) {
      case 'normal':
        return <NormalApp />;
      case 'optimized':
        return <OptimizedApp />;
      default:
        return <NormalApp />;
    }
  };

  return (
    <>
      <FpsView />
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        'z-index': 10000,
        'background-color': 'white',
        padding: '10px',
        border: '1px solid #ccc',
        'border-radius': '5px',
        'box-shadow': '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', 'font-size': '14px' }}>SolidJS 性能对比测试</h3>
        <div style={{ display: 'flex', 'flex-direction': 'column', gap: '5px' }}>
          <button 
            onClick={() => setCurrentApp('normal')}
            style={{
              padding: '5px 10px',
              'background-color': currentApp() === 'normal' ? '#007acc' : '#f0f0f0',
              color: currentApp() === 'normal' ? 'white' : 'black',
              border: 'none',
              'border-radius': '3px',
              cursor: 'pointer',
              'font-size': '12px'
            }}
          >
             普通版本
           </button>
           <button 
             onClick={() => setCurrentApp('optimized')}
             style={{
               padding: '5px 10px',
               'background-color': currentApp() === 'optimized' ? '#007acc' : '#f0f0f0',
               color: currentApp() === 'optimized' ? 'white' : 'black',
               border: 'none',
               'border-radius': '3px',
               cursor: 'pointer',
               'font-size': '12px'
             }}
           >
             优化版本
          </button>
        </div>
        <div style={{ 'margin-top': '10px', 'font-size': '11px', color: '#666' }}>
          当前: {currentApp()}<br/>
          拖动绿色区域测试性能<br/>
          观察左上角 FPS 数值
        </div>
      </div>
      {renderApp()}
    </>
  );
};

export default App;
