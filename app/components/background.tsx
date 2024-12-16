"use client";

import { useEffect, useState, useRef } from "react";

interface SquareProps {
  size: number;
  isPainted: boolean;
  index: number;
  squaresPerRow: number;
  color: string;
}

interface SquaredLayoutProps {
  paintedSquareRatio: number;
  colorChangeInterval: [number, number];
  squareColor?: string;
}

const SquaredLayout: React.FC<SquaredLayoutProps> = ({
  paintedSquareRatio,
  colorChangeInterval,
  squareColor = "transparent",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numSquares, setNumSquares] = useState(0);
  const [squareSize, setSquareSize] = useState(0);
  const [squareStates, setSquareStates] = useState<{ isPainted: boolean; color: string }[]>([]);
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({ rows: 0, cols: 0 });

  // Function to calculate square size and total number of squares dynamically
  const calculateSquares = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    let targetSquaresPerRow;

    // Determine target squares per row based on container size
    if (containerWidth < 768) {
      targetSquaresPerRow = 12;
    } else if (containerWidth < 1200) {
      targetSquaresPerRow = 18;
    } else {
      targetSquaresPerRow = 36;
    }

    const squareSize = Math.floor(containerWidth / targetSquaresPerRow);

    const cols = Math.floor(containerWidth / squareSize);
    const rows = Math.floor(containerHeight / squareSize);

    const totalSquares = cols * rows;

    setSquareSize(squareSize);
    setNumSquares(totalSquares);
    setGridSize({ rows, cols });
    initializeSquareStates(totalSquares);
  };

  // Function to initialize square states (painted or not + color)
  const initializeSquareStates = (total: number) => {
    const states = Array.from({ length: total }, () => ({
      isPainted: Math.random() < paintedSquareRatio / 100,
      color: squareColor,
    }));
    setSquareStates(states);
  };

  useEffect(() => {
    // Initial calculation of squares
    calculateSquares();

    // Add resize listener to the container
    const handleResize = () => {
      calculateSquares();
    };

    const container = containerRef.current;
    container?.addEventListener("resize", handleResize);

    return () => {
      container?.removeEventListener("resize", handleResize);
    };
  }, []);

  // Effect to randomly update square states continuously
  useEffect(() => {
    const intervals = squareStates.map((_, index) =>
      setInterval(() => {
        setSquareStates((prevStates) => {
          const newStates = [...prevStates];
          const shouldPaint = Math.random() < paintedSquareRatio / 100;
          newStates[index] = {
            isPainted: shouldPaint,
            color: shouldPaint ? generateSquareColor() : squareColor,
          };
          return newStates;
        });
      }, Math.random() * colorChangeInterval[1] + colorChangeInterval[0])
    );

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [numSquares]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Net Layer */}
      <div
        className="absolute flex items-center justify-center w-full h-full pointer-events-none"
        style={{
          zIndex: 0,
        }}
      >
        <Net rows={gridSize.rows} cols={gridSize.cols} squareSize={squareSize} containerHeight={containerRef.current?.offsetHeight || 0} />
      </div>

      {/* Squares Layer */}
      <div className="flex flex-wrap items-center justify-center w-full h-full relative">
        {squareStates.map((state, index) => (
          <Square
            key={index}
            index={index}
            size={squareSize}
            isPainted={state.isPainted}
            color={state.color}
            squaresPerRow={gridSize.cols}
          />
        ))}
      </div>
    </div>
  );
};

const Square: React.FC<SquareProps> = ({ size, color, isPainted }) => {
  const shadowSize1 = size * 0.1;
  const shadowSize2 = size * 0.2;
  const shadowSize3 = size * 0.4;
  const transitionStyle = "1.5s ease";

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        transition: `background-color ${transitionStyle}, box-shadow ${transitionStyle}, z-index ${transitionStyle}`,
        boxShadow: isPainted
          ? `0 0 ${shadowSize1}px ${color}, 0 0 ${shadowSize2}px ${color}, 0 0 ${shadowSize3}px ${color}`
          : "none",
        zIndex: isPainted ? 1 : 0,
      }}
      className={`flex-shrink-0`}
    ></div>
  );
};

// Net Component
const Net: React.FC<{ rows: number; cols: number; squareSize: number; containerHeight: number }> = ({ rows, cols, squareSize, containerHeight }) => {
  const [screenSize, setScreenSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  const lineStyle = {
    backgroundColor: "#333", // Net line color
    position: "absolute" as const,
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Trigger resize on mount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const netWidth = cols * squareSize;
  const netHeight = containerHeight; // Ensure the net fills the container's height

  // Avoid sub-pixel calculations and use floor to make sure the grid always fits
  const offsetX = Math.floor((screenSize.width - netWidth) / 2);
  const offsetY = Math.floor((screenSize.height - netHeight) / 2);

  // Create horizontal net lines
  const horizontalLines = Array.from({ length: rows + 1 }).map((_, i) => (
    <div
      key={`h-${i}`}
      style={{
        ...lineStyle,
        top: `${offsetY + i * squareSize}px`,
        left: `${offsetX}px`,
        width: `${netWidth}px`,
        height: "1px",
      }}
    ></div>
  ));

  // Create vertical net lines
  const verticalLines = Array.from({ length: cols + 1 }).map((_, i) => (
    <div
      key={`v-${i}`}
      style={{
        ...lineStyle,
        left: `${offsetX + i * squareSize}px`,
        top: `${offsetY}px`,
        height: `${netHeight}px`,
        width: "1px",
      }}
    ></div>
  ));

  return <>{[...horizontalLines, ...verticalLines]}</>;
};

// Random color generator for squares
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

export default SquaredLayout;
