import type React from 'react';
import { useCallback, useMemo,useState } from 'react';
import { count } from './count';

interface MoveItemProps {
  x: number;
  index: number;
}

const MoveItem = ({ x, index }: MoveItemProps) => {
  // 去掉注释的情况下，性能会大幅提升，因为不再需要用 react 重新渲染了
  const computedStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    top: 200 + 10 * index,
    // transform: `translateX(${x.peek() - 50}px)`,
    transform: `translateX(${x - 50}px)`,
    zIndex: 9999,
    width: (1000 + index) % 10,
    height: 10,
    backgroundColor: 'red',
  }), [x, index]);

  return <div style={computedStyle} />;
};

function useX() {
  const x = useState<number>(0);
  return x;
}

interface TrackProps {
  xState: ReturnType<typeof useX>;
}

const Track = ({ xState }: TrackProps) => {
  // div 起始位置
  const [x , setX] = xState;
  const [startX, setStartX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const onMouseDown = useCallback((ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseStartX(ev.clientX);
    setDragging(true);
    setX(ev.clientX);
    setStartX(x);
  }, [x, setX]);

  const onMouseMove = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!dragging) return;
      // 移动距离
      // console.log([x.peek(), startX.peek(), mouseStartX.peek()]);
      // 设置最终位置
      const distance = ev.clientX - mouseStartX;
      // 所以拿不到更新后的 startX 和 moveStartX
      setX(startX + distance);
    },
    [startX, mouseStartX, setX, dragging],
  );
  const onMouseUpOrBlue = useCallback(() => {
    setDragging(false);
  }, []);

  const track = useMemo(() => {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
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
        source 拖动这个 div 改变上面 div 的位置 {x}
      </div>
    );
  }, [onMouseDown, onMouseMove, onMouseUpOrBlue, x]);

  return track;
};

const list = Array.from({ length: count })
    .fill(0)
    .map((_, index) => index);

const App = () => {
  // 当前位置
  const x = useX();

  return (
    <>
      <Track xState={x} />
      {list.map((item) => (
        <MoveItem key={item} x={x[0]} index={item} />
      ))}
    </>
  );
}
export default App;
