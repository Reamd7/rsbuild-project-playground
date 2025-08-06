/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import './App.css';
import {
  batch,
  createMemo,
  createSignal,
  For,
} from 'solid-js';
import type { JSX, Signal } from 'solid-js';
import { createElementList } from './constants';

interface MoveItemProps {
  x: Signal<number>;
  index: number;
}

const MoveItem = (props: MoveItemProps) => {
  const [getX] = props.x;
  
  // 预计算静态样式
  const staticTop = 200 + 10 * props.index;
  const staticWidth = (1000 + props.index) % 10;
  
  // 只有transform会变化，其他样式保持静态
  const transform = createMemo(() => `translateX(${getX() - 50}px)`);
  
  return (
    <div 
      style={{
        position: 'absolute',
        top: `${staticTop}px`,
        transform: transform(),
        'z-index': 9999,
        width: `${staticWidth}px`,
        height: '10px',
        'background-color': 'red',
        'will-change': 'transform', // 优化GPU加速
      }} 
    />
  );
};

interface TrackProps {
  x: Signal<number>;
}

const Track = (props: TrackProps) => {
  const [getX, setX] = props.x;
  let startX = 0;
  let mouseStartX = 0;
  let dragging = false;
  let rafId = 0;
  
  const onMouseDown = (ev: MouseEvent) => {
    mouseStartX = ev.clientX;
    dragging = true;
    setX(ev.clientX);
    startX = ev.clientX;
  };

  const onMouseMove = (ev: MouseEvent) => {
    if (!dragging) return;
    
    // 使用requestAnimationFrame节流更新
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const distance = ev.clientX - mouseStartX;
      batch(() => {
        setX(startX + distance);
      });
    });
  };

  const onMouseUpOrBlue = () => {
    dragging = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '100px',
        left: 0,
        right: 0,
        'z-index': 9999,
        height: `100px`,
        'background-color': 'green',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUpOrBlue}
      onBlur={onMouseUpOrBlue}
    >
      SolidJS 拖动这个 div 改变上面 div 的位置 {getX()} (优化版本)
    </div>
  );
};

// 减少渲染数量以提升性能
const list = createElementList();

const OptimizedApp = () => {
  const x = createSignal(0);
  // div 起始位置
  return (
    <>
      <Track x={x} />
      <For each={list}>{(item) => <MoveItem x={x} index={item} />}</For>
    </>
  );
};

export default OptimizedApp;