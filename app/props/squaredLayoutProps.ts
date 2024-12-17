export interface SquaredLayoutProps {
  paintedSquareRatio: number;
  square: {
    defaultColor: string;
    changeToDefaultColorInterval: {
      from: number;
      to: number;
    }
  };
  gap: {
    size: number;
    color: string;
  };
}

