/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import './App.css';
import {
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
  const computedStyle = createMemo<JSX.CSSProperties>(() => ({
    position: 'absolute',
    top: `${200 + 10 * props.index}px`,
    transform: `translateX(${getX() - 50}px)`,
    'z-index': 9999,
    width: `${(1000 + props.index) % 10}px`,
    height: '10px',
    'background-color': 'red',
  }));
  return <div style={computedStyle()} />;
};

interface TrackProps {
  x: Signal<number>;
}

const Track = (props: TrackProps) => {
  const [getX, setX] = props.x;
  let startX = 0;
  let mouseStartX = 0;
  let dragging = false;
  const onMouseDown = (ev: MouseEvent) => {
    mouseStartX = ev.clientX;
    dragging = true;
    setX(ev.clientX);
    startX = ev.clientX;
  };

  const onMouseMove = (ev: MouseEvent) => {
    if (!dragging) return;
    const distance = ev.clientX - mouseStartX;
    setX(startX + distance);
  };

  const onMouseUpOrBlue = () => {
    dragging = false;
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
      SolidJS 拖动这个 div 改变上面 div 的位置 {getX()} (普通版本)
    </div>
  );
};

const list = createElementList();

const NormalApp = () => {
  const x = createSignal(0);
  
  return (
    <>
      <Track x={x} />
      <For each={list}>{(item) => <MoveItem x={x} index={item} />}</For>
    </>
  );
};

export default NormalApp;