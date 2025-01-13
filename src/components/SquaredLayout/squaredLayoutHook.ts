import { useState, useLayoutEffect, useMemo, useCallback, useRef } from "react";
import { SquaredLayoutConfig } from "../../types/squaredLayout";
import { randomString } from "../../utils/random";

interface GridSize {
  rows: number;
  cols: number;
}

interface SquareState {
  isPainted: boolean;
  color: string;
}

interface LayoutCalcResult {
  squareSize: number;
  gridSize: GridSize;
  padding: {
    horizontal: number;
    vertical: number;
  };
}

export function useSquaredLayout(props: SquaredLayoutConfig) {
  const [squareStates, setSquareStates] = useState<SquareState[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // Calculate optimal layout using container dimensions
  const layout = useMemo((): LayoutCalcResult => {
    const { width, height } = props.container;

    let left = 20;
    let right = 100;
    let bestLayout: LayoutCalcResult | null = null;
    let bestScore = -Infinity;

    while (left <= right) {
      const squareSize = Math.floor((left + right) / 2);
      const cols = Math.floor((width + props.net.width) / (squareSize + props.net.width));
      const rows = Math.floor((height + props.net.width) / (squareSize + props.net.width));

      const usedWidth = cols * squareSize + (cols - 1) * props.net.width;
      const usedHeight = rows * squareSize + (rows - 1) * props.net.width;

      const coverage = (usedWidth * usedHeight) / (width * height);
      const aspectRatioScore = 1 - Math.abs((width / height) - (usedWidth / usedHeight));
      const score = coverage * 0.7 + aspectRatioScore * 0.3;

      if (score > bestScore) {
        bestScore = score;
        bestLayout = {
          squareSize,
          gridSize: { rows, cols },
          padding: {
            horizontal: Math.max(0, (width - usedWidth) / 2),
            vertical: Math.max(0, (height - usedHeight) / 2)
          }
        };
      }

      if (coverage < 0.9) {
        right = squareSize - 1;
      } else {
        left = squareSize + 1;
      }
    }

    return bestLayout!;
  }, [props.container.width, props.container.height, props.net.width]);

  const scheduleColorChange = useCallback((index: number) => {
    const { from, to } = props.square.changeToDefaultColorInterval;
    const timeout = Math.random() * (to - from) + from;

    return setTimeout(() => {
      setSquareStates(prev => {
        if (!prev[index]) return prev;
        const next = [...prev];
        next[index] = {
          isPainted: false,
          color: props.square.defaultColor
        };
        return next;
      });
    }, timeout);
  }, [props.square.changeToDefaultColorInterval, props.square.defaultColor]);

  const initializeSquareStates = useCallback(() => {
    // Clear existing intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    const totalSquares = layout.gridSize.rows * layout.gridSize.cols;
    const states = Array.from({ length: totalSquares }, () => {
      const shouldPaint = Math.random() < props.paintedSquareRatio / 100;
      return {
        isPainted: shouldPaint,
        color: shouldPaint
          ? randomString(props.colorScheme || [])
          : props.square.defaultColor
      };
    });

    setSquareStates(states);

    // Schedule initial color changes for painted squares
    states.forEach((state, index) => {
      if (state.isPainted) {
        scheduleColorChange(index);
      }
    });

    // Set up continuous updates
    const newIntervals = states.map((_, index) => {
      return setInterval(() => {
        setSquareStates(prev => {
          if (!prev[index]) return prev;
          const shouldPaint = Math.random() < props.paintedSquareRatio / 100;
          const next = [...prev];

          next[index] = {
            isPainted: shouldPaint,
            color: shouldPaint
              ? randomString(props.colorScheme || [])
              : props.square.defaultColor
          };

          if (shouldPaint) {
            scheduleColorChange(index);
          }

          return next;
        });
      }, Math.random() *
      (props.square.changeToDefaultColorInterval.to - props.square.changeToDefaultColorInterval.from) +
      props.square.changeToDefaultColorInterval.from);
    });

    intervalsRef.current = newIntervals;
  }, [
    layout.gridSize.rows,
    layout.gridSize.cols,
    props.paintedSquareRatio,
    props.colorScheme,
    props.square.defaultColor,
    props.square.changeToDefaultColorInterval,
    scheduleColorChange
  ]);

  // Initialize layout and square states
  useLayoutEffect(() => {
    initializeSquareStates();

    return () => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [initializeSquareStates]);

  return {
    squareSize: layout.squareSize,
    squareStates,
    gridSize: layout.gridSize,
    padding: layout.padding
  };
}