/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import type React from 'react';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { useSignal, useComputed, Signal, signal } from '@preact/signals-react';
import { For, useSignalRef } from '@preact/signals-react/utils';
import { useRef } from 'react';
import { count } from './count';

interface MoveItemProps { 
  x: Signal<number>,
  index: number
}

const MoveItem = ({ x, index }: MoveItemProps) => {
  // 去掉注释的情况下，性能会大幅提升，因为不再需要用 react 重新渲染了
  useSignals();
  const computedStyle = useComputed<React.CSSProperties>(() => ({
    position: 'absolute',
    top: 200 + 10 * index,
    transform: `translateX(${x.peek() - 50}px)`,
    // transform: `translateX(${x.value - 50}px)`,
    zIndex: 9999,
    width: (1000 + index) % 10,
    height: 10,
    backgroundColor: 'red',
  }));

  const elementRef = useSignalRef<HTMLDivElement | null>(null);

  useSignalEffect(() => {
    if (elementRef.value) {
      elementRef.value.style.transform = `translateX(${x.value - 50}px)`;
    }
  });

  return useComputed(() => {
    return <div style={computedStyle.value} ref={elementRef} />;
  });
};

interface TrackProps {
  x: Signal<number>,
}

const Track = ({ x }: TrackProps) => {
  useSignals();
  // div 起始位置
  const startX = useSignal(0);
  const mouseStartX = useSignal(0);
  const dragging = useSignal(false);
  const onMouseDown = useComputed(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      mouseStartX.value = ev.clientX;
      dragging.value = true;
      x.value = ev.clientX;
      startX.value = x.peek();
    };
  });
  
  const onMouseMove = useComputed(() => {
    if (!dragging.value) return () => {};

    return ((ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // 移动距离
      // console.log([x.peek(), startX.peek(), mouseStartX.peek()]);
      // 设置最终位置
      const distance = ev.clientX - mouseStartX.peek();
      // 所以拿不到更新后的 startX 和 moveStartX
      x.value = startX.peek() + distance;
    });
  });
  const onMouseUpOrBlue = useComputed(() => {
    return () => {
      dragging.value = false;
    };
  });

  const track = useComputed(() => {
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
        onMouseDown={onMouseDown.value}
        onMouseMove={onMouseMove.value}
        onMouseUp={onMouseUpOrBlue.value}
        onBlur={onMouseUpOrBlue.value}
      >
        preact signals 拖动这个 div 改变上面 div 的位置 {x}
      </div>
    );
  });

  return track;
};

const list = signal(Array.from({ length: count }).fill(0).map((item, index) => index));
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
