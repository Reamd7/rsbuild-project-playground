import { For, createMemo } from 'solid-js';
import useFps from './useFps';
import useStyles from './useStyles';

interface ComponentProps {
  width?: number;
  height?: number;
  top?: number | string;
  left?: number | string;
  bottom?: number | string;
  right?: number | string;
}

const FpsView = (props: ComponentProps) => {
  const {
    width = 140,
    height = 60,
    top = 0,
    left = 0,
    bottom = 'auto',
    right = 'auto'
  } = props;

  const { fps, avgFps, maxFps, currentFps } = useFps(Math.floor(width / 2));
  const { graphStyle, barStyle, wrapperStyle } = useStyles(
    width,
    height,
    top,
    right,
    bottom,
    left,
    () => fps().length
  );

  // 缓存FPS文本显示
  const fpsText = createMemo(() => `${currentFps()} FPS (${avgFps()} Avg)`);
  
  // 缓存最大FPS值以减少重复计算
  const maxFpsValue = createMemo(() => maxFps());

  return (
    <div style={wrapperStyle()}>
      <span>{fpsText()}</span>
      <div style={graphStyle()}>
        <For each={fps()}>
          {(val, i) => {
            const barHeight = createMemo(() => (height * val) / maxFpsValue());
            return <div style={barStyle(barHeight(), i())} />;
          }}
        </For>
      </div>
    </div>
  );
};

export default FpsView;