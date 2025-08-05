import { signal, computed, effect, Signal, useSignalEffect } from '@preact/signals';
import { useSignal, useComputed } from '@preact/signals';
import type { JSX } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { count } from './count';
import { FpsMonitor } from './FpsMonitor';

interface MoveItemProps { 
  x: Signal<number>,
  index: number
}

const MoveItem = ({ x, index }: MoveItemProps) => {
  const computedStyle = useComputed(() => ({
    position: 'absolute' as const,
    top: 200 + 10 * index,
    transform: `translateX(${x.peek() + 50}px)`,
    zIndex: 9999,
    width: (1000 + index) % 10,
    height: 10,
    backgroundColor: 'red',
  }));

  const elementRef = useRef<HTMLDivElement | null>(null);

  useSignalEffect(() => {
    if (elementRef.current) {
      elementRef.current.style.transform = `translateX(${x.value + 50}px)`;
    }
  });

  return useComputed(() => {
    return <div style={computedStyle.value} ref={elementRef} />;
  }).value;
};

interface TrackProps {
  x: Signal<number>,
}

const Track = ({ x }: TrackProps) => {
  // div 起始位置
  const startX = useSignal(0);
  const mouseStartX = useSignal(0);
  const dragging = useSignal(false);
  
  const onMouseDown = useComputed(() => {
    return (ev: JSX.TargetedMouseEvent<HTMLDivElement>) => {
      mouseStartX.value = ev.clientX;
      dragging.value = true;
      x.value = ev.clientX;
      startX.value = x.peek();
    };
  });
  
  const onMouseMove = useComputed(() => {
    if (!dragging.value) return () => {};

    return ((ev: JSX.TargetedMouseEvent<HTMLDivElement>) => {
      // 移动距离
      // 设置最终位置
      const distance = ev.clientX - mouseStartX.peek();
      // 所以拿不到更新后的 startX 和 moveStartX
      x.value = startX.peek() + distance;
    });
  });
  
  const onMouseUpOrBlur = useComputed(() => {
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
        onMouseUp={onMouseUpOrBlur.value}
        onBlur={onMouseUpOrBlur.value}
      >
        preact signals 拖动这个 div 改变上面 div 的位置 {x}
      </div>
    );
  });

  return track.value;
};

const list = signal(Array.from({ length: count }).fill(0).map((item, index) => index));

const App = () => {
  // 当前位置
  const x = useSignal(0);

  return (
    <>
      <FpsMonitor />
      <Track x={x} />
      {list.value.map((item) => (
        <MoveItem key={item} x={x} index={item} />
      ))}
    </>
  );
};

export default App;