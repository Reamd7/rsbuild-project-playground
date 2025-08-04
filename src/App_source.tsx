//react
import React, { useCallback, useEffect, useRef, useState } from 'react';


const useMemoFn = <T extends (...args: any[]) => any>(fn: T) => {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []);
}

const App = () => {
  // 当前位置
  const [x, setX] = useState(0);
  // div 起始位置
  const [startX, setStartX] = useState(0);
  // move 起始位置
  const [moveStartX, setMoveStartX] = useState(0);

  // 每次触发 mouseMove 都会触发 render
  console.log('render');

  const dragStart = useMemoFn((ev) => {
    setStartX(x);
    setMoveStartX(ev.clientX);

    // 这个 dragging 是 setState 之前的 dragging
    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('blur', dragEnd);
  })

  // 实际上这个会变
  const dragging = useMemoFn((ev) => {
    // 所以拿不到更新后的 startX 和 moveStartX
    console.log([startX, moveStartX]);
    // 移动距离
    const distance = ev.clientX - moveStartX;
    // 设置最终位置
    setX(startX + distance);
  });

  const dragEnd = useMemoFn(() => {
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('blur', dragEnd);
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: x - 50,
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