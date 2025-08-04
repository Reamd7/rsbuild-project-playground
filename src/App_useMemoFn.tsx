//react
import React, { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';


const useMemoFn = <T extends (...args: any[]) => any>(fn: T) => {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []);
}

const App = () => {
  const [div, setDiv] = useState<HTMLDivElement | null  >(null);
  // 当前位置
  const [x, setX] = useState(0);
  const xRef = useRef(x);
  xRef.current = x;
  useLayoutEffect(() => {
    // div 起始位置
    let startX = 0;
    // move 起始位置
    let moveStartX = 0;

    const dragStart = ((ev) => {
      startX = xRef.current;
      moveStartX = ev.clientX;
      if (!div) return;
      // 这个 dragging 是 setState 之前的 dragging
      div.addEventListener('mousemove', dragging);
      div.addEventListener('mouseup', dragEnd);
      div.addEventListener('blur', dragEnd)
    })
    // 实际上这个会变
    const dragging = ((ev) => {
      // 所以拿不到更新后的 startX 和 moveStartX
      console.log({ startX, moveStartX });
      // 移动距离
      const distance = ev.clientX - moveStartX;
      // 设置最终位置
      setX(startX + distance);
      xRef.current = startX + distance;
    });
    const dragEnd = (() => {
      div?.removeEventListener('mousemove', dragging);
      div?.removeEventListener('mouseup', dragEnd);
      div?.removeEventListener('blur', dragEnd);
    });
    div?.addEventListener('mousedown', ev => dragStart(ev));
    return () => {
      dragEnd();
    }
  }, [div])
  // 每次触发 mouseMove 都会触发 render
  console.log('render');
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
        ref={setDiv}
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: 100,
          backgroundColor: 'green',
        }}
        // onMouseDown={ev => dragStart(ev.nativeEvent)}
      >
        拖动这个 div 改变上面 div 的位置
      </div>
    </>
  );
};
export default App;