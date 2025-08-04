/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import type React from 'react';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { useSignal, useComputed, Signal } from '@preact/signals-react';
import { useSignalRef } from '@preact/signals-react/utils';

const MoveItem = ({ x }: { x: Signal<number> }) => {
  // 去掉注释的情况下，性能会大幅提升，因为不再需要用 react 重新渲染了
  useSignals();
  const computedStyle = useComputed<React.CSSProperties>(() => ({
    position: 'absolute',
    top: 100,
    // left: x.peek() - 50,
    left: x.value - 50,
    zIndex: 9999,
    width: 100,
    height: 100,
    backgroundColor: 'red',
  }));

  const elementRef = useSignalRef<HTMLDivElement | null>(null);

  // useSignalEffect(() => {
  //   if (elementRef.value) {
  //     elementRef.value.style.left = `${x.value - 50}px`;
  //   }
  // });

  return useComputed(() => {
    return <div style={computedStyle.value} ref={elementRef} />;
  });
};

const Track = ({ x }: { x: Signal<number> }) => {
  useSignals();
  // div 起始位置
  const startX = useSignal(0);
  const mouseStartX = useSignal(0);
  const dragging = useSignal(false);
  const onMouseDown = useComputed(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      startX.value = x.peek();
      mouseStartX.value = ev.clientX;
      dragging.value = true;
    };
  });
  const onMouseMove = useComputed(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!dragging.value) return;
      requestAnimationFrame(() => {
        // 移动距离
        console.log([x.peek(), startX.peek(), mouseStartX.peek()]);
        // 设置最终位置
        const distance = ev.clientX - mouseStartX.peek();
        // 所以拿不到更新后的 startX 和 moveStartX
        x.value = startX.peek() + distance;
      })
    };
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
          top: 200,
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
        拖动这个 div 改变上面 div 的位置 {x}
      </div>
    );
  });

  return track;
};

const App = () => {
  useSignals();
  // 当前位置
  const x = useSignal(0);

  return (
    <>
      <MoveItem x={x} />
      <Track x={x} />
    </>
  );
};
export default App;
