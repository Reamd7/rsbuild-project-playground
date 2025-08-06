import { createSignal, onMount, onCleanup, createMemo } from 'solid-js';

export default function useFps(windowWidth: number) {
  const [fps, setFps] = createSignal<number[]>([]);
  const [currentFpsValue, setCurrentFpsValue] = createSignal(0);
  
  let lastFpsValues: number[] = [];
  let frames = 0;
  let prevTime = performance.now();
  let animRef = 0;
  let lastUpdateTime = 0;

  const calcFps = () => {
    const t = performance.now();
    frames += 1;

    // 每秒更新一次FPS显示
    if (t > prevTime + 1000) {
      const elapsedTime = t - prevTime;
      const currentFps = Math.round((frames * 1000) / elapsedTime);
      
      // 更新当前FPS值
      setCurrentFpsValue(currentFps);
      
      // 只在需要时更新FPS数组（减少频繁更新）
      if (t - lastUpdateTime > 500) { // 每500ms更新一次图表
        lastFpsValues = lastFpsValues.concat(currentFps);

        if (elapsedTime > 1500) {
          for (let i = 1; i <= (elapsedTime - 1000) / 1000; i++) {
            lastFpsValues = lastFpsValues.concat(0);
          }
        }

        lastFpsValues = lastFpsValues.slice(Math.max(lastFpsValues.length - windowWidth, 0));
        setFps([...lastFpsValues]);
        lastUpdateTime = t;
      }

      frames = 0;
      prevTime = t;
    }

    animRef = requestAnimationFrame(calcFps);
  };

  onMount(() => {
    animRef = requestAnimationFrame(calcFps);
  });

  onCleanup(() => {
    cancelAnimationFrame(animRef);
  });

  // 使用createMemo缓存计算结果
  const avgFps = createMemo(() => {
    const fpsArray = fps();
    return fpsArray.length > 0 ? (fpsArray.reduce((a, b) => a + b, 0) / fpsArray.length).toFixed(2) : '0.00';
  });
  
  const maxFps = createMemo(() => {
    const fpsArray = fps();
    return fpsArray.length > 0 ? Math.max(...fpsArray) : 0;
  });
  
  const currentFps = () => currentFpsValue();

  return { fps, avgFps, maxFps, currentFps };
}