import { FC, useEffect, useState } from "react";
import Blob, { BlobConfig } from "./Blob";
import { defaultColorScheme } from "../../utils/defaultColorScheme";
import { randomNum, randomString } from "../../utils/random";
import { BlobLayoutConfig } from "../../types/blobLayout";
import { FromTo, Size } from "../../types/base";

const ANIMATION_FRAME_RATE = 16;
const usedColors = new Set<string>();
const VELOCITY_DRIFT = 2;

const createBlob = (
  id: number,
  colorScheme: string[],
  sizeRange: FromTo,
  speedRange: FromTo,
  container: Size,
  rotationSpeedRange: FromTo,
  morphing: { speed: FromTo; intensity: FromTo }
): BlobConfig => {
  const size = randomNum(sizeRange.from, sizeRange.to);
  const direction = Math.random() > 0.5 ? 1 : -1;
  let possibleColors = colorScheme.filter((color) => !usedColors.has(color));
  if (possibleColors.length === 0) {
    usedColors.clear();
    possibleColors = colorScheme;
  }
  const color = randomString(possibleColors);

  // Add the selected color to the usedColors set
  usedColors.add(color);

  // Ensure initial position is fully within bounds accounting for blob size
  const margin = size / 2;
  return {
    id,
    color: color,
    size: { width: size, height: size },
    position: {
      x: randomNum(margin, container.width - margin),
      y: randomNum(margin, container.height - margin),
    },
    velocity: {
      x: randomNum(speedRange.from, speedRange.to) * direction,
      y: randomNum(speedRange.from, speedRange.to) * direction * 0.67,
    },
    rotation: randomNum(rotationSpeedRange.from, rotationSpeedRange.to) * Math.PI * 2,
    morphSpeed: randomNum(morphing.speed.from, morphing.speed.to),
    morphIntensity: randomNum(morphing.intensity.from, morphing.intensity.to),
    numPoints: Math.floor(4 + Math.random() * 6),
    seed: Math.random() * 300000,
  };
};

const BlobLayout: FC<BlobLayoutConfig> = ({
  numBlobs = 9,
  colorScheme = defaultColorScheme,
  opacity = 1,
  size = { from: 200, to: 300 },
  speed = { from: 2, to: 6 },
  rotationSpeed = { from: -0.3, to: 2 },
  container,
  morphing = { 
    speed: { from: 4, to: 12 }, 
    intensity: { from: 0.2, to: 0.8 }
  },
  backgroundColor = "#043f70"
}: BlobLayoutConfig) => {
  const [blobs, setBlobs] = useState<BlobConfig[]>([]);

  useEffect(() => {
    const initialBlobs = Array.from({ length: numBlobs }, (_, i) =>
      createBlob(i, colorScheme, size, speed, container, rotationSpeed, morphing)
    );
    setBlobs(initialBlobs);
  }, []);

  useEffect(() => {
    const updateBlobPositions = () => {
      setBlobs((prevBlobs) =>
        prevBlobs.map((blob) => {
          // Add small random drift to create organic movement
          let newVx = blob.velocity.x + (Math.random() - 0.5) * VELOCITY_DRIFT * 0.2;
          let newVy = blob.velocity.y + (Math.random() - 0.5) * VELOCITY_DRIFT * 0.2;

          // Clamp velocities
          newVx = Math.max(Math.min(newVx, speed.to), -speed.to);
          newVy = Math.max(Math.min(newVy, speed.to), -speed.to);

          // Calculate new position
          let newX = blob.position.x + newVx;
          let newY = blob.position.y + newVy;

          // Keep within bounds
          const margin = blob.size.width / 2;
          const rightBound = container.width - margin;
          const bottomBound = container.height - margin;

          if (newX < margin) {
            newX = margin;
            newVx = Math.abs(newVx);
          } else if (newX > rightBound) {
            newX = rightBound;
            newVx = -Math.abs(newVx);
          }

          if (newY < margin) {
            newY = margin;
            newVy = Math.abs(newVy);
          } else if (newY > bottomBound) {
            newY = bottomBound;
            newVy = -Math.abs(newVy);
          }

          return {
            ...blob,
            position: { x: newX, y: newY },
            velocity: { x: newVx, y: newVy },
          };
        })
      );
    };

    const interval = setInterval(updateBlobPositions, ANIMATION_FRAME_RATE);
    return () => clearInterval(interval);
  }, [container, speed.to]);

  return (
    <svg width={container.width} height={container.height} style={{ backgroundColor: backgroundColor }}>
      {blobs.map((blob) => (
        <Blob key={blob.id} {...blob} opacity={opacity} />
      ))}
    </svg>
  );
};

export { BlobLayout };
export type { BlobLayoutConfig };