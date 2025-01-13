import { FromTo } from "./base";

export interface BlobLayoutConfig {
  numBlobs?: number;
  colorScheme?: string[];
  opacity?: number;
  size?: FromTo;
  container: { width: number; height: number };
  speed?: FromTo;
  rotationSpeed?: FromTo;
  morphing?: { speed: FromTo; intensity: FromTo };
  backgroundColor?: string;
}