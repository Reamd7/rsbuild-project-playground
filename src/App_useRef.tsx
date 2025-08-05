//react
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import React, {
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const App = () => {
  // 当前位置
  const [x, setX] = useState(0);
  const xRef = useRef(x);
  xRef.current = x;
  // div 起始位置
  const startX = useRef(0);
  // move 起始位置
  const mouseStartX = useRef(0);
  // 每次触发 mouseMove 都会触发 render
  console.log('render');
  const dragging = useRef(false);
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
        onMouseDown={(ev) => {
          startX.current = xRef.current;
          mouseStartX.current = ev.clientX;
          dragging.current = true;
        }}
        onMouseMove={(ev) => {
          if (!dragging.current) return;
          // 所以拿不到更新后的 startX 和 moveStartX
          console.log({ startX, mouseStartX });
          // 移动距离
          const distance = ev.clientX - mouseStartX.current;
          // 设置最终位置
          setX(startX.current + distance);
          xRef.current = startX.current + distance;
        }}
        onMouseUp={() => {
          dragging.current = false;
        }}
        onBlur={() => {
          dragging.current = false;
        }}
      >
        useRef 拖动这个 div 改变上面 div 的位置 {x}
      </div>
    </>
  );
};
export default App;
