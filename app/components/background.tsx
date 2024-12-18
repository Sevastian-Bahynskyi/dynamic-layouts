"use client";

import { useSquaredLayout } from "../hooks/squaredLayoutHook";
import { SquaredLayoutProps } from "../props/squaredLayoutProps";

const SquaredLayout: React.FC<SquaredLayoutProps> = ({
  paintedSquareRatio,
  square,
  net
}) => {
  const { squareSize, squareStates, gridSize } = useSquaredLayout({paintedSquareRatio, square, net});

  return (
      <div className="flex flex-wrap items-center justify-center w-fit h-full relative">
        {squareStates.map((state, index) => (
          <Square
            key={index}
            index={index}
            size={squareSize}
            isPainted={state.isPainted}
            color={state.color}
            squaresPerRow={gridSize.cols}
            changeTransition={square.changeTransition}
            net={net}
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
  net: {
    width: number;
    color: string;
  };
}

const Square: React.FC<SquareProps> = ({ size, color, isPainted, changeTransition, net }) => {
  const shadowSize1 = size * 0.1;
  const shadowSize2 = size * 0.2;
  const shadowSize3 = size * 0.4;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        transition: `background-color ${changeTransition}, box-shadow ${changeTransition}, z-index ${changeTransition}, border-color ${changeTransition}`,
        boxShadow: isPainted
          ? `0 0 ${shadowSize1}px ${color}, 0 0 ${shadowSize2}px ${color}, 0 0 ${shadowSize3}px ${color}`
          : "none",
        border: isPainted ? "transparent" : `${net.width}px solid ${net.color}`,
        zIndex: isPainted ? 1 : 0
      }}
      className={`flex-shrink-0`}
    ></div>
  );
};

// Random color generator for squares


export default SquaredLayout;
