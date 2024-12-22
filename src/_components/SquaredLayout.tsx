import { useSquaredLayout } from "../_hooks/squaredLayoutHook";
import { SquaredLayoutProps } from "../props/squaredLayoutProps";
import { defaultColorScheme } from "../_utils/defaultColorScheme";

const SquaredLayout: React.FC<SquaredLayoutProps> = ({
  paintedSquareRatio,
  square,
  net,
  colorScheme = defaultColorScheme
}) => {
  const { squareSize, squareStates, gridSize } = useSquaredLayout({paintedSquareRatio, square, net, colorScheme});

  return (
      <div className="flex flex-wrap items-center justify-center w-fit h-full relative" style={{ gap: `${net.width}px`, backgroundColor: net.color }}>
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
        transition: `background-color ${changeTransition}, box-shadow ${changeTransition}, z-index ${changeTransition}`,
        boxShadow: isPainted
          ? `0 0 ${shadowSize1}px ${color}, 0 0 ${shadowSize2}px ${color}, 0 0 ${shadowSize3}px ${color}`
          : "none",
          zIndex: isPainted ? 1 : 0
      }}
      className={`flex-shrink-0`}
    ></div>
  );
};

export { SquaredLayout }; 