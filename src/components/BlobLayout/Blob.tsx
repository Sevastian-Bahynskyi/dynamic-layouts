import * as d3 from "d3";
import { useRef, useEffect } from "react";
import { Point, Size } from "../../types/base";

interface BlobConfig {
  id: number;
  color: string;
  size: Size;
  position: Point;
  velocity: Point;
  rotation: number;
  morphSpeed: number;
  morphIntensity: number;
  numPoints: number;
  seed: number;
  opacity?: number;
}

const Blob: React.FC<BlobConfig> = (props) => {
  const blobRef = useRef<SVGPathElement>(null);
  const noiseOffsetRef = useRef(0);

  useEffect(() => {
    if (!blobRef.current) return;

    const noise2D = (x: number, y: number, seed: number) => {
      return (
        Math.sin(x * 0.5 + y * 0.75 + seed) *
        Math.cos(x * 0.6 + y * 0.45 + seed)
      );
    };

    const generatePoints = (time: number) => {
      const points = [];
      const angleStep = (Math.PI * 2) / props.numPoints;
      const baseRadius = Math.min(props.size.width, props.size.height) / 2;

      for (let i = 0; i < props.numPoints; i++) {
        const angle = i * angleStep + props.rotation;
        const noiseValue =
          noise2D(
            Math.cos(angle) * 2 + time * 0.3,
            Math.sin(angle) * 2 + time * 0.3,
            props.seed
          ) *
            0.5 +
          noise2D(
            Math.cos(angle) * 4 + time * 0.2,
            Math.sin(angle) * 4 + time * 0.2,
            props.seed + 1000
          ) *
            0.3 +
          noise2D(
            Math.cos(angle) * 8 + time * 0.1,
            Math.sin(angle) * 8 + time * 0.1,
            props.seed + 2000
          ) *
            0.2;

        const radius = baseRadius * (1 + noiseValue * props.morphIntensity);
        points.push([
          props.position.x + radius * Math.cos(angle),
          props.position.y + radius * Math.sin(angle)
        ] as [number, number]);
      }
      return points;
    };

    const animate = () => {
      noiseOffsetRef.current += 0.01 * props.morphSpeed;
      const points: Array<[number, number]> = generatePoints(noiseOffsetRef.current);
      const path = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))(points);
      if (path) d3.select(blobRef.current).attr("d", path);
    };

    animate();
  }, [props]);

  return (
    <path
      ref={blobRef}
      fill={props.color}
      fillOpacity={props.opacity ?? 0.8}
      style={{
        filter: `url(#blob-shadow-${props.id})`,
        transition: "all 0.1s ease-in-out"
      }}
    />
  );
};

export  default Blob;
export type { BlobConfig };