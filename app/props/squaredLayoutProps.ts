export interface SquaredLayoutProps {
  paintedSquareRatio: number;
  square: {
    defaultColor: string;
    changeToDefaultColorInterval: {
      from: number;
      to: number;
    },
    changeTransition: string;
  };
  gap: {
    size: number;
    color: string;
  };
}

