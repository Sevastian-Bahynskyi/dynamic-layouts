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
            changeTransition={square.changeTransition}
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
  changeTransition: string;
}

const Square: React.FC<SquareProps> = ({ size, color, isPainted, changeTransition}) => {
  const shadowSize1 = size * 0.1;
  const shadowSize2 = size * 0.2;
  const shadowSize3 = size * 0.4;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        transition: `background-color ${changeTransition}, box-shadow ${changeTransition}`,
        boxShadow: isPainted
          ? `0 0 ${shadowSize1}px ${color}, 0 0 ${shadowSize2}px ${color}, 0 0 ${shadowSize3}px ${color}`
          : "none"
      }}
      className={`flex-shrink-0`}
    ></div>
  );
};

// Random color generator for squares


export default SquaredLayout;
