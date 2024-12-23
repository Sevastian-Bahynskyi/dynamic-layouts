import { useState, useLayoutEffect } from "react";
import { SquaredLayoutProps } from "../../props/squaredLayoutProps";

export function useSquaredLayout(props: SquaredLayoutProps) {
  const [numSquares, setNumSquares] = useState(0);
  const [squareSize, setSquareSize] = useState(0);
  const [squareStates, setSquareStates] = useState<{ isPainted: boolean; color: string }[]>([]);
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({ rows: 0, cols: 0 });

  const calculateSquares = () => {
    let targetSquaresPerRow;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Determine target squares per row based on container size
    if (containerWidth < 768) {
      targetSquaresPerRow = 12;
    } else if (containerWidth < 1200) {
      targetSquaresPerRow = 18;
    } else {
      targetSquaresPerRow = 36;
    }

    const squareSize = Math.floor(containerWidth / targetSquaresPerRow) - props.net.width;

    const cols = Math.floor(containerWidth / (squareSize + props.net.width));
    const rows = Math.floor(containerHeight / (squareSize + props.net.width));

    const totalSquares = cols * rows;

    setSquareSize(squareSize);
    setNumSquares(totalSquares);
    setGridSize({ rows, cols });
    initializeSquareStates(totalSquares);
  };

  const initializeSquareStates = (total: number) => {
    const states = Array.from({ length: total }, () => {
      const shouldPaint = shouldPaintSquare(props.paintedSquareRatio);
      const initialColor = shouldPaint ? generateSquareColor(props.colorScheme!) : props.square.defaultColor;

      const squareState = {
        isPainted: shouldPaint,
        color: initialColor,
      };

      if (shouldPaint) {
        setTimeout(() => {
          setSquareStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[states.indexOf(squareState)] = {
              isPainted: false,
              color: props.square.defaultColor,
            };
            return newStates;
          });
        }, randomTimeout(props.square.changeToDefaultColorInterval));
      }

      return squareState;
    });

    setSquareStates(states);
  };

  const updateSquareStatesContinuously = () => {
    const intervals = squareStates.map((_, index) =>
      setInterval(() => {
        setSquareStates((prevStates) => {
          const newStates = [...prevStates];
          const shouldPaint = shouldPaintSquare(props.paintedSquareRatio);
          newStates[index] = {
            isPainted: shouldPaint,
            color: shouldPaint ? generateSquareColor(props.colorScheme!) : props.square.defaultColor,
          };
          return newStates;
        });
      }, randomTimeout(props.square.changeToDefaultColorInterval))
    );

    return () => {
      intervals.forEach(clearInterval);
    };
  };

  // Initialize the square layout on component mount
  useLayoutEffect(() => {
    calculateSquares();
    window.addEventListener("resize", calculateSquares);
    return () => {
      window.removeEventListener("resize", calculateSquares);
    };
  }, []);

  // Effect to randomly update square states continuously
  useLayoutEffect(() => {
    const cleanup = updateSquareStatesContinuously();
    return cleanup;
  }, [numSquares]);

  return { squareSize, squareStates, gridSize };
}

function shouldPaintSquare(paintedSquareRatio: number) {
    return Math.random() < paintedSquareRatio / 100;
}

function randomTimeout(timeInterval: { from: number; to: number }) {
    return Math.random() * timeInterval.to + timeInterval.from;
}

function generateSquareColor(colorScheme: string[]) {
    return colorScheme[Math.floor(Math.random() * colorScheme.length)];
}