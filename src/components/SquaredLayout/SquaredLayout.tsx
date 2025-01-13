import { useSquaredLayout } from "./squaredLayoutHook";
import "../../../index.css";
import { SquaredLayoutConfig } from "../../types/squaredLayout";
import { defaultColorScheme } from "../../utils/defaultColorScheme";
import { Size } from "../../types/base";

interface SquaredLayoutProps extends Omit<SquaredLayoutConfig, 'container'> {
  container: Size;
  className?: string;
  centerOnPage?: boolean;
}

const SquaredLayout: React.FC<SquaredLayoutProps> = ({
  paintedSquareRatio,
  square,
  net,
  colorScheme = defaultColorScheme,
  container,
  className = '',
  centerOnPage = true
}) => {
  const { squareSize, squareStates, gridSize, padding } = useSquaredLayout({
    paintedSquareRatio,
    square,
    net,
    colorScheme,
    container
  });

  // Calculate total width and height of the grid
  const gridWidth = gridSize.cols * squareSize + (gridSize.cols - 1) * net.width;
  const gridHeight = gridSize.rows * squareSize + (gridSize.rows - 1) * net.width;

  // Generate vertical grid lines
  const verticalLines = Array.from({ length: gridSize.cols - 1 }, (_, i) => (
    <div
      key={`v-${i}`}
      className="absolute"
      style={{
        left: `${(i + 1) * squareSize + i * net.width}px`,
        top: 0,
        width: `${net.width}px`,
        height: `${gridHeight}px`,
        backgroundColor: net.color
      }}
    />
  ));

  // Generate horizontal grid lines
  const horizontalLines = Array.from({ length: gridSize.rows - 1 }, (_, i) => (
    <div
      key={`h-${i}`}
      className="absolute"
      style={{
        left: 0,
        top: `${(i + 1) * squareSize + i * net.width}px`,
        width: `${gridWidth}px`,
        height: `${net.width}px`,
        backgroundColor: net.color
      }}
    />
  ));

  return (
    <div 
      className={`relative ${centerOnPage ? 'mx-auto' : ''} ${className}`}
      style={{
        width: container.width,
        height: container.height
      }}
    >
      <div
        className="absolute"
        style={{
          left: padding.horizontal,
          top: padding.vertical,
          width: gridWidth,
          height: gridHeight
        }}
      >
        {/* Grid lines */}
        {verticalLines}
        {horizontalLines}
        
        {/* Squares */}
        <div
          className="absolute top-0 left-0 grid"
          style={{
            gap: `${net.width}px`,
            gridTemplateColumns: `repeat(${gridSize.cols}, ${squareSize}px)`,
            gridTemplateRows: `repeat(${gridSize.rows}, ${squareSize}px)`
          }}
        >
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
      </div>
    </div>
  );
};

interface SquareProps {
  size: number;
  isPainted: boolean;
  index: number;
  squaresPerRow: number;
  color: string;
  changeTransition: number;
}

const Square: React.FC<SquareProps> = ({ size, color, isPainted, changeTransition }) => {
  const shadowSize1 = size * 0.1;
  const shadowSize2 = size * 0.2;
  const shadowSize3 = size * 0.4;

  const changeTransitionStr = (transition: number = changeTransition) => `${transition}ms ease-in-out`;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        transition: `all ${changeTransitionStr()}`,
        boxShadow: isPainted
          ? `0 0 ${shadowSize1}px ${color}, 0 0 ${shadowSize2}px ${color}, 0 0 ${shadowSize3}px ${color}`
          : "none",
        zIndex: isPainted ? 1 : 0
      }}
      className="flex-shrink-0"
    />
  );
};

export { SquaredLayout };