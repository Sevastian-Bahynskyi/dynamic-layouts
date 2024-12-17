import { useState, useLayoutEffect } from "react";
import { SquaredLayoutProps } from "../props/squaredLayoutProps";

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

    const squareSize = Math.floor(containerWidth / targetSquaresPerRow) - props.gap.size;

    const cols = Math.floor(containerWidth / (squareSize + props.gap.size));
    const rows = Math.floor(containerHeight / (squareSize + props.gap.size));

    const totalSquares = cols * rows;

    setSquareSize(squareSize);
    setNumSquares(totalSquares);
    setGridSize({ rows, cols });
    initializeSquareStates(totalSquares);
  };

  const initializeSquareStates = (total: number) => {
    const states = Array.from({ length: total }, () => ({
      isPainted: false,
      color: props.square.defaultColor,
    }));
    setSquareStates(states);
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
    const intervals = squareStates.map((_, index) =>
      setInterval(() => {
        setSquareStates((prevStates) => {
          const newStates = [...prevStates];
          const shouldPaint = Math.random() < props.paintedSquareRatio / 100;
          newStates[index] = {
            isPainted: shouldPaint,
            color: shouldPaint ? generateSquareColor() : props.square.defaultColor,
          };
          return newStates;
        });
      }, Math.random() * props.square.changeToDefaultColorInterval.to + props.square.changeToDefaultColorInterval.from)
    );

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [numSquares]);

  return { squareSize, squareStates, gridSize };
}

function generateSquareColor() {
    const neonColors: string[] = [
      "#39FF14", // Neon Green
      "#7DF9FF", // Electric Blue
      "#FF6EC7", // Neon Pink
      "#FFEA00", // Bright Yellow
      "#FF6700", // Neon Orange
      "#BC13FE", // Neon Purple
      "#FF073A", // Cyber Red
      "#00FFFF", // Aqua Cyan
      "#D0FF14", // Lime Yellow
      "#E9E0FF", // Neon Lavender
      "#FF9A8B", // Fluorescent Peach
      "#01F9C6", // Bright Teal
    ];
  
    return neonColors[Math.floor(Math.random() * neonColors.length)];
}