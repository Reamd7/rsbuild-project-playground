/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import type React from 'react';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { useSignal, useComputed, Signal, signal } from '@preact/signals-react';
import { For, useSignalRef } from '@preact/signals-react/utils';
import { count } from './count';
import { batch } from '@preact/signals-react';
import { useRef } from 'react';
import styles from './App.module.css';

interface MoveItemProps { 
  x: Signal<number>,
  index: number
}

const MoveItem = ({ x, index }: MoveItemProps) => {
  // 去掉注释的情况下，性能会大幅提升，因为不再需要用 react 重新渲染了
  useSignals();
  const computedStyle = useComputed<React.CSSProperties & any>(() => ({
    top: 200 + 10 * index,
    // transform: `translate(${x.peek() + 50}px)`,
    transform: `translateX(${x.value - 50}px)`,
    width: (1000 + index) % 10,
  }));

  const elementRef = useSignalRef<HTMLDivElement | null>(null);

  const className = useComputed(() => {
    return [styles.move_item, styles[`w-${(index % 10) + 1}`]].join(' ');
  })

  // useSignalEffect(() => {
  //   if (elementRef.value) {
  //     elementRef.value.style.transform = `translateX(${x.value + 50}px)`;
  //   }
  // });

  return <div className={className.value} style={computedStyle.value} ref={elementRef} />;
};

interface TrackProps {
  x: Signal<number>,
}

const Track = ({ x }: TrackProps) => {
  useSignals();
  // div 起始位置
  const startX = useRef(0);
  const mouseStartX = useRef(0);
  const dragging = useRef(false);
  const onMouseDown = useComputed(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      mouseStartX.current = ev.clientX;
      dragging.current = true;
      x.value = ev.clientX;
      startX.current = x.peek();
    };
  });
  
  const onMouseMove = useComputed(() => {
    return ((ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!dragging.current) return ;
      batch(() => {
        // 移动距离
        // console.log([x.peek(), startX.peek(), mouseStartX.peek()]);
        // 设置最终位置
        const distance = ev.clientX - mouseStartX.current;
        // 所以拿不到更新后的 startX 和 moveStartX  
        x.value = startX.current + distance;
      })
    });
  });
  const onMouseUpOrBlue = useComputed(() => {
    return () => {
      dragging.current = false;
    };
  });

  const track = useComputed(() => {
    return (
      <div
        className={styles.track}
        onMouseDown={onMouseDown.value}
        onMouseMove={onMouseMove.value}
        onMouseUp={onMouseUpOrBlue.value}
        onBlur={onMouseUpOrBlue.value}
      >
        preact signals 拖动这个 div 改变上面 div 的位置 
        {/* <span>{x}</span> */}
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
