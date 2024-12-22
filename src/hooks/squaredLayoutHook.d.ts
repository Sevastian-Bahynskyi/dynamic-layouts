import { SquaredLayoutProps } from "../props/squaredLayoutProps";
export declare function useSquaredLayout(props: SquaredLayoutProps): {
    squareSize: number;
    squareStates: {
        isPainted: boolean;
        color: string;
    }[];
    gridSize: {
        rows: number;
        cols: number;
    };
};
