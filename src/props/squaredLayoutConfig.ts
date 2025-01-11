export interface SquaredLayoutConfig {
  paintedSquareRatio: number;
  square: {
    defaultColor: string;
    changeToDefaultColorInterval: {
      from: number;
      to: number;
    },
    changeTransition: string;
  };
  net: {
    width: number;
    color: string;
  };
  colorScheme?: string[];
}

