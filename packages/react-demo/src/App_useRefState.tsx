//react
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { count } from './count';

function useRefState<T>(
  initialValue: () => T,
): [() => T, T, (fn: (prev: T) => T) => void] {
  const [state, _setState] = useState(initialValue);
  const ref = useRef(state);
  ref.current = state;
  const setState = useCallback((fn: (prev: T) => T) => {
    _setState((prev) => {
      ref.current = fn(prev);
      return ref.current;
    });
  }, []);
  const getState = useCallback(() => ref.current, []);
  return [getState, state, setState];
}

interface MoveItemProps {
  x: number;
  index: number;
}

const MoveItem = ({ x, index }: MoveItemProps) => {
  // 去掉注释的情况下，性能会大幅提升，因为不再需要用 react 重新渲染了
  const computedStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: 200 + 10 * index,
    // left: x.peek() - 50,
    transform: `translateX(${x - 50}px)`,
    zIndex: 9999,
    width: (1000 + index) % 10,
    height: 10,
    backgroundColor: 'red',
  }), [index, x]);
  const divRef = useRef<HTMLDivElement>(null);
  // useSignalEffect(() => {
  //   if (elementRef.value) {
  //     elementRef.value.style.left = `${x.value - 50}px`;
  //   }
  // });

  // !! 很有意思，在 preact_signals 中也有类似的优化方案跳过整个react 树的 diff ，但是在这里就是没有很好的效果，
  // useLayoutEffect(() => {
  //   if (divRef.current) {
  //     divRef.current.style.transform = `translateX(${x() - 50}px)`;
  //   }
  // }, [x()]);

  const result = useMemo(() => {
    return <div style={computedStyle} ref={divRef} />;
  }, [computedStyle]);

  return result;
};

interface TrackProps {
  x: () => number;
  setX: (fn: (prev: number) => number) => void;
}

const Track = ({ x, setX }: TrackProps) => {
  // div 起始位置
  const startX = useRef(0);
  const mouseStartX = useRef(0);
  const dragging = useRef(false);
  const onMouseDown = useMemo(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      mouseStartX.current = ev.clientX;
      dragging.current = true;
      setX(() => ev.clientX);
      startX.current = ev.clientX;
    };
  }, [setX]);

  const onMouseMove = useMemo(() => {
    return (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!dragging.current) return;
      // 移动距离
      // console.log([x.peek(), startX.peek(), mouseStartX.peek()]);
      // 设置最终位置
      const distance = ev.clientX - mouseStartX.current;
      // 所以拿不到更新后的 startX 和 moveStartX
      setX(() => startX.current + distance);
    };
  }, [setX]);
  const onMouseUpOrBlue = useMemo(() => {
    return () => {
      dragging.current = false;
    };
  }, []);

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
      onMouseUp={onMouseUpOrBlue}
      onBlur={onMouseUpOrBlue}
    >
      useRefState 拖动这个 div 改变上面 div 的位置 {x()}
    </div>
  );
};

const list = Array.from({ length: count })
  .fill(0)
  .map((item, index) => index);

const App = () => {
  // 当前位置
  const [getX, x, setX] = useRefState(() => 0);
  return (
    <>
      <Track x={getX} setX={setX} />
      {list.map((item) => {
        return <MoveItem x={x} index={item} key={item} />;
      })}
    </>
  );
};
export default App;
