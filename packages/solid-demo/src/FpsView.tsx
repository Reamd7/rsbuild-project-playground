import { For } from 'solid-js';
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

  return (
    <div style={wrapperStyle()}>
      <span>{currentFps()} FPS ({avgFps()} Avg)</span>
      <div style={graphStyle()}>
        <For each={fps()}>
          {(val, i) => (
            <div style={barStyle((height * val) / maxFps(), i())} />
          )}
        </For>
      </div>
    </div>
  );
};

export default FpsView;