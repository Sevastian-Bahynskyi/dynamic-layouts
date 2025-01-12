import { FromTo } from "./base";

export interface SquaredLayoutConfig {
  paintedSquareRatio: number;
  square: {
    defaultColor: string;
    changeToDefaultColorInterval: FromTo;
    changeTransition: string;
  };
  net: {
    width: number;
    color: string;
  };
  colorScheme?: string[];
}

