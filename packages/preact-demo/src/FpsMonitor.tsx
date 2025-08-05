import { FpsView } from 'react-fps';

export function FpsMonitor() {
  return (
    <FpsView
      width={140}
      height={60}
      top={10}
      left={10}
    />
  );
}