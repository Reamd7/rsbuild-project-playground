//react
import React, { useCallback, useEffect, useRef, useState } from 'react';

function useRefState<T>(initialValue: () => T): [() => T, (fn: (prev: T) => T) => void] {
  const [state, _setState] = useState(initialValue);
  const ref = useRef(state);
  const setState = useCallback((fn: (prev: T) => T) => {
    _setState((prev) => {
      ref.current = fn(prev);
      return ref.current;
    });
  }, []);
  const getState = useCallback(() => ref.current, []);
  return [getState, setState];
}


const App = () => {
  // 当前位置
  const [x, setX] = useRefState(() => 0);
  // div 起始位置
  const startX = useRef(0);
  // move 起始位置
  const moveStartX = useRef(0);

  // 每次触发 mouseMove 都会触发 render
  console.log('render');

  const dragStart = useCallback((ev) => {
    startX.current = x();
    moveStartX.current = ev.clientX;

    // 这个 dragging 是 setState 之前的 dragging
    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('blur', dragEnd);
  }, [x])

  // 实际上这个会变
  const dragging = useCallback((ev) => {
    // 所以拿不到更新后的 startX 和 moveStartX
    console.log({ startX: startX.current, moveStartX: moveStartX.current });
    // 移动距离
    const distance = ev.clientX - moveStartX.current;
    // 设置最终位置
    setX(() => startX.current + distance);
  }, [setX]);

  const dragEnd = useCallback(() => {
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('blur', dragEnd);
  }, [dragging]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: x() - 50,
          zIndex: 9999,
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
      ></div>

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
        onMouseDown={ev => dragStart(ev.nativeEvent)}
      >
        拖动这个 div 改变上面 div 的位置
      </div>
    </>
  );
};
export default App;