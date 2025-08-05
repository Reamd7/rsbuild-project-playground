//react optimized version
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { count } from './count';

// 优化的 useRefState，支持直接 DOM 操作模式
function useRefState<T>(
  initialValue: () => T,
): [() => T, T, (fn: (prev: T) => T) => void, (value: T) => void, (listener: (value: T) => void) => () => void] {
  const [state, _setState] = useState(initialValue);
  const ref = useRef(state);
  const listenersRef = useRef<Set<(value: T) => void>>(new Set());
  
  ref.current = state;
  
  const setState = useCallback((fn: (prev: T) => T) => {
    _setState((prev) => {
      const newValue = fn(prev);
      ref.current = newValue;
      // 通知所有监听器
      listenersRef.current.forEach(listener => listener(newValue));
      return newValue;
    });
  }, []);
  
  const setStateDirectly = useCallback((value: T) => {
    ref.current = value;
    // 只通知监听器，不触发 React 重新渲染
    listenersRef.current.forEach(listener => listener(value));
  }, []);
  
  const getState = useCallback(() => ref.current, []);
  
  const subscribe = useCallback((listener: (value: T) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);
  
  return [getState, state, setState, setStateDirectly, subscribe];
}

interface MoveItemProps {
  x: number;
  index: number;
  getX: () => number;
  subscribe: (listener: (value: number) => void) => () => void;
}

// 使用 React.memo 优化，只有 index 变化时才重新渲染
const MoveItem = React.memo(({ x, index, getX, subscribe }: MoveItemProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  
  // 初始样式，不依赖 x 值
  const staticStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: 200 + 10 * index,
    transform: `translateX(${x - 50}px)`, // 初始位置
    zIndex: 9999,
    width: (1000 + index) % 10,
    height: 10,
    backgroundColor: 'red',
  }), [index, x]); // x 只用于初始位置
  
  // 订阅 x 值变化，直接操作 DOM
  useLayoutEffect(() => {
    if (!divRef.current) return;
    
    const updatePosition = (newX: number) => {
      if (divRef.current) {
        divRef.current.style.transform = `translateX(${newX - 50}px)`;
      }
    };
    
    // 设置初始位置
    updatePosition(getX());
    
    // 订阅变化
    const unsubscribe = subscribe(updatePosition);
    
    return unsubscribe;
  }, [getX, subscribe]);
  
  return <div style={staticStyle} ref={divRef} />;
}, (prevProps, nextProps) => {
  // 自定义比较函数：只有 index 变化时才重新渲染
  return prevProps.index === nextProps.index;
});

interface TrackProps {
  x: () => number;
  setX: (fn: (prev: number) => number) => void;
  setXDirectly: (value: number) => void;
}

const Track = ({ x, setX, setXDirectly }: TrackProps) => {
  const startX = useRef(0);
  const mouseStartX = useRef(0);
  const dragging = useRef(false);
  const rafId = useRef<number>();
  
  const onMouseDown = useCallback((ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouseStartX.current = ev.clientX;
    dragging.current = true;
    setX(() => ev.clientX);
    startX.current = ev.clientX;
  }, [setX]);

  const onMouseMove = useCallback((ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!dragging.current) return;
    
    // 使用 requestAnimationFrame 节流更新
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      const distance = ev.clientX - mouseStartX.current;
      const newX = startX.current + distance;
      // 使用直接更新模式，避免触发 React 重新渲染
      setXDirectly(newX);
    });
  }, [setXDirectly]);
  
  const onMouseUpOrBlur = useCallback(() => {
    dragging.current = false;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
  }, []);
  
  // 使用事件委托优化
  useLayoutEffect(() => {
    const handleGlobalMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        const distance = ev.clientX - mouseStartX.current;
        const newX = startX.current + distance;
        setXDirectly(newX);
      });
    };
    
    const handleGlobalMouseUp = () => {
      dragging.current = false;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [setXDirectly]);

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
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUpOrBlur}
      onBlur={onMouseUpOrBlur}
    >
      useRefState 优化版本 - 拖动这个 div 改变上面 div 的位置 {x()}
    </div>
  );
};

// 预计算列表，避免每次渲染重新创建
const list = Array.from({ length: count }, (_, index) => index);

const App = () => {
  const [getX, x, setX, setXDirectly, subscribe] = useRefState(() => 0);
  
  return (
    <>
      <Track x={getX} setX={setX} setXDirectly={setXDirectly} />
      {list.map((item) => (
        <MoveItem 
          key={item} 
          x={x} 
          index={item} 
          getX={getX}
          subscribe={subscribe}
        />
      ))}
    </>
  );
};

export default App;