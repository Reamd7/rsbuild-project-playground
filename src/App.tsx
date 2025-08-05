/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import type React from 'react';
import { useSignalRef } from '@preact/signals-react/utils';
import { createSignal, withSolid, createComputed, createMemo } from 'react-solid-state';
import type { Signal } from 'solid-js/types/reactive/signal.d.ts';

type MoveItemProps = {
  x: Signal<number>;
};
const MoveItem = withSolid<MoveItemProps>((props) => {
  const getX = props.x[0];
  // 去掉注释的情况下，性能会大幅提升，因为不再需要用 react 重新渲染了
  const computedStyle = createMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    top: 100,
    // left: x.peek() - 50,
    left: getX() - 50,
    zIndex: 9999,
    width: 100,
    height: 100,
    backgroundColor: 'red',
  }));

  const elementRef = useSignalRef<HTMLDivElement | null>(null);

  return () => <div style={computedStyle()} ref={elementRef} />
});

const Track = withSolid<MoveItemProps>((props) => {
  const [getX, setX] = props.x;
  // div 起始位置
  const [startX, setStartX]: Signal<number> = createSignal(0);
  const [mouseStartX, setMouseStartX]: Signal<number> = createSignal(0);
  const [dragging, setDragging]: Signal<boolean> = createSignal(false);
  const onMouseDown = createMemo(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setMouseStartX(ev.clientX);
      setDragging(true);
      setX(ev.clientX);
      setStartX(getX());
    };
  });
  const onMouseMove = createMemo(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!dragging()) return;
      // 移动距离
      console.log([getX(), startX(), mouseStartX()]);
      // 设置最终位置
      const distance = ev.clientX - mouseStartX();
      // 所以拿不到更新后的 startX 和 moveStartX
      setX(startX() + distance);
    };
  });
  const onMouseUpOrBlue = createMemo(() => {
    return () => {
      setDragging(false);
    };
  });

  const text = createMemo(() => {
    return `react solid state 拖动这个 div 改变上面 div 的位置 ${getX()}`;
  });

  return (() => {
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
        onMouseDown={onMouseDown()}
        onMouseMove={onMouseMove()}
        onMouseUp={onMouseUpOrBlue()}
        onBlur={onMouseUpOrBlue()}
      >
        {text()}
      </div>
    );
  });
});

const App = withSolid(() => {
  // 当前位置
  const x: Signal<number> = createSignal(0);

  return () => (
    <>
      <MoveItem x={x} />
      <Track x={x} />
    </>
  );
});
export default App;
