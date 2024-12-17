"use client";

import { useSquaredLayout } from "../hooks/squaredLayoutHook";
import { SquaredLayoutProps } from "../props/squaredLayoutProps";

const SquaredLayout: React.FC<SquaredLayoutProps> = ({
  paintedSquareRatio,
  square,
  gap
}) => {
  const { squareSize, squareStates, gridSize } = useSquaredLayout({paintedSquareRatio, square, gap});

  return (
      <div className="flex flex-wrap items-center justify-center w-fit h-full relative" style={{ gap: `${gap.size}px`, backgroundColor: gap.color }}>
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
  );
};

interface SquareProps {
  size: number;
  isPainted: boolean;
  index: number;
  squaresPerRow: number;
  color: string;
}

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

// Random color generator for squares


export default SquaredLayout;
