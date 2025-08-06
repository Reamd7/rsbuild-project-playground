import { createMemo } from 'solid-js';
import type { JSX } from 'solid-js';

type CssProp = number | string;

export default function useStyles(
  width: number,
  height: number,
  top: CssProp,
  right: CssProp,
  bottom: CssProp,
  left: CssProp,
  fpsLength: () => number
) {
  const wrapperStyle = createMemo<JSX.CSSProperties>(() => ({
    'z-index': 999999,
    position: 'fixed',
    width: width + 6 + 'px',
    height: height + 30 + 'px',
    padding: '3px',
    'background-color': '#21006f',
    color: '#26F0FD',
    'font-size': '1rem',
    'line-height': '1.3rem',
    'font-family': 'Helvetica, Arial, sans-serif',
    'font-weight': '300',
    'box-sizing': 'border-box',
    top: typeof top === 'number' ? `${top}px` : top,
    right: typeof right === 'number' ? `${right}px` : right,
    bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
    left: typeof left === 'number' ? `${left}px` : left,
  }));

  const graphStyle = createMemo<JSX.CSSProperties>(() => ({
    position: 'absolute',
    left: '3px',
    right: '3px',
    bottom: '3px',
    height: height + 'px',
    'background-color': '#282844',
    'box-sizing': 'border-box'
  }));

  const barStyle = (calcHeight: number, i: number): JSX.CSSProperties => ({
    position: 'absolute',
    bottom: '0',
    right: ((fpsLength() - 1 - i) * 4) + 'px',
    height: calcHeight + 'px',
    width: '4px',
    'background-color': '#E200F7',
    'box-sizing': 'border-box'
  });

  return { wrapperStyle, graphStyle, barStyle };
}