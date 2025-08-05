/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import type React from 'react';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { useSignal, useComputed, Signal, signal } from '@preact/signals-react';
import { For, useSignalRef } from '@preact/signals-react/utils';
import { count } from './count';

interface MoveItemProps { 
  x: Signal<number>,
  index: number
}

const MoveItem = ({ x, index }: MoveItemProps) => {
  // 移除 useSignals() 以获得最佳性能
  // useSignals();
  
  // 预计算静态样式，避免每次重新计算
  const staticStyle: React.CSSProperties = {
    position: 'absolute',
    top: 200 + 10 * index,
    transform: `translateX(-50px)`, // 初始位置
    zIndex: 9999,
    width: (1000 + index) % 10,
    height: 10,
    backgroundColor: 'red',
  };

  const elementRef = useSignalRef<HTMLDivElement | null>(null);

  // 优化的信号效果，直接操作 transform 属性
  useSignalEffect(() => {
    const element = elementRef.value;
    if (element) {
      // 使用 transform3d 启用硬件加速
      element.style.transform = `translate3d(${x.value + 50}px, 0, 0)`;
    }
  });

  // 直接返回 JSX，避免不必要的 useComputed 包装
  return <div style={staticStyle} ref={elementRef} />;
};

interface TrackProps {
  x: Signal<number>,
}

const Track = ({ x }: TrackProps) => {
  useSignals();
  
  // 使用 ref 而不是 signal 来存储不需要响应式的状态
  const startXRef = { current: 0 };
  const mouseStartXRef = { current: 0 };
  const draggingRef = { current: false };
  const rafIdRef = { current: 0 };
  
  // 优化的事件处理器，减少函数创建开销
  const onMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouseStartXRef.current = ev.clientX;
    draggingRef.current = true;
    x.value = ev.clientX;
    startXRef.current = ev.clientX;
  };
  
  const onMouseMove = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!draggingRef.current) return;
    
    // 使用 requestAnimationFrame 节流，避免过度更新
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      const distance = ev.clientX - mouseStartXRef.current;
      x.value = startXRef.current + distance;
    });
  };
  
  const onMouseUpOrBlur = () => {
    draggingRef.current = false;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };
  
  // 添加全局事件监听以改善拖拽体验
  useSignalEffect(() => {
    const handleGlobalMouseMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      rafIdRef.current = requestAnimationFrame(() => {
        const distance = ev.clientX - mouseStartXRef.current;
        x.value = startXRef.current + distance;
      });
    };
    
    const handleGlobalMouseUp = () => {
      draggingRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  });

  // 直接返回 JSX，避免不必要的 useComputed
  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 100,
        backgroundColor: 'green',
        cursor: 'grab',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUpOrBlur}
      onBlur={onMouseUpOrBlur}
    >
      preact signals 优化版本 - 拖动这个 div 改变上面 div 的位置 {x}
    </div>
  );
};

// 预计算列表，避免每次重新创建
const list = signal(Array.from({ length: count }, (_, index) => index));

const App = () => {
  useSignals();
  // 当前位置
  const x = useSignal(0);

  return (
    <>
      <Track x={x} />
      <For each={list}>
        {(item) => (
          <MoveItem key={item} x={x} index={item} />
        )}
      </For>
    </>
  );
};

export default App;