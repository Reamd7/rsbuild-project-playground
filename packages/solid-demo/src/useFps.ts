import { createSignal, onMount, onCleanup } from 'solid-js';

export default function useFps(windowWidth: number) {
  const [fps, setFps] = createSignal<number[]>([]);
  
  let lastFpsValues: number[] = [];
  let frames = 0;
  let prevTime = performance.now();
  let animRef = 0;

  const calcFps = () => {
    const t = performance.now();

    frames += 1;

    if (t > prevTime + 1000) {
      const elapsedTime = t - prevTime;

      const currentFps = Math.round((frames * 1000) / elapsedTime);

      lastFpsValues = lastFpsValues.concat(currentFps);

      if (elapsedTime > 1500) {
        for (let i = 1; i <= (elapsedTime - 1000) / 1000; i++) {
          lastFpsValues = lastFpsValues.concat(0);
        }
      }

      lastFpsValues = lastFpsValues.slice(Math.max(lastFpsValues.length - windowWidth, 0));

      setFps([...lastFpsValues]);

      frames = 0;
      prevTime = performance.now();
    }

    animRef = requestAnimationFrame(calcFps);
  };

  onMount(() => {
    animRef = requestAnimationFrame(calcFps);
  });

  onCleanup(() => {
    cancelAnimationFrame(animRef);
  });

  const avgFps = () => {
    const fpsArray = fps();
    return fpsArray.length > 0 ? (fpsArray.reduce((a, b) => a + b, 0) / fpsArray.length).toFixed(2) : '0.00';
  };
  
  const maxFps = () => {
    const fpsArray = fps();
    return fpsArray.length > 0 ? Math.max(...fpsArray) : 0;
  };
  
  const currentFps = () => {
    const fpsArray = fps();
    return fpsArray[fpsArray.length - 1] || 0;
  };

  return { fps, avgFps, maxFps, currentFps };
}