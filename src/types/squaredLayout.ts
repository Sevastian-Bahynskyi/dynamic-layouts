import { FromTo, Size } from "./base";

export interface SquaredLayoutConfig {
  paintedSquareRatio: number;
  square: {
    defaultColor: string;
    changeToDefaultColorInterval: FromTo;
    changeTransition: number;
  };
  net: {
    width: number;
    color: string;
  };
  colorScheme?: string[];
  container: Size;
}

