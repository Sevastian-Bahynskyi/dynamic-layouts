import { FC, useEffect, useState } from "react";
import Blob, { BlobConfig } from "./Blob";
import { defaultColorScheme } from "../../utils/defaultColorScheme";
import { BlobLayoutConfig } from "../../..";

const createBlob = (id: number, width: number, height: number, colorScheme: string[]): BlobConfig => {
  const size = 80 + Math.random() * 80;
  return {
    id,
    color: colorScheme[Math.floor(Math.random() * defaultColorScheme.length)],
    width: size,
    height: size,
    x: Math.random() * (width - size * 2) + size,
    y: Math.random() * (height - size * 2) + size,
    vx: (Math.random() * 3 + 1) * (Math.random() > 0.5 ? 1 : -1), // Randomized speed and direction
    vy: (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.3) * 0.02,
    morphSpeed: 1.3 + Math.random() * 4,
    morphIntensity: 0.2 + Math.random() * 1.3,
    numPoints: Math.floor(4 + Math.random() * 6),
    seed: Math.random() * 300000,
  };
};

const BlobLayout: FC<BlobLayoutConfig> = ({
  numBlobs = 14,
  colorScheme = defaultColorScheme,
  opacity = 0.8,
}: BlobLayoutConfig) => {
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [blobs, setBlobs] = useState<BlobConfig[]>([]);

  useEffect(() => {
    // Check if we're running on the client
    if (typeof window !== "undefined") {
      setIsClient(true);
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", updateDimensions);

      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const initialBlobs = Array.from({ length: numBlobs }, (_, i) =>
        createBlob(i, dimensions.width, dimensions.height, colorScheme)
      );
      setBlobs(initialBlobs);
    }
  }, [isClient, dimensions, colorScheme, numBlobs]);

  useEffect(() => {
    if (isClient) {
      const updateBlobPositions = () => {
        setBlobs((prevBlobs) =>
          prevBlobs.map((blob) => {
            const newX = blob.x + blob.vx;
            const newY = blob.y + blob.vy;
            let newVx = blob.vx + (Math.random() - 0.5) * 0.2; // Random drift in velocity
            let newVy = blob.vy + (Math.random() - 0.5) * 0.2;

            // Allow blobs to cross fully beyond half their size before bouncing
            const halfWidth = blob.width / 2;
            const halfHeight = blob.height / 2;

            if (newX < -halfWidth || newX > dimensions.width + halfWidth) {
              newVx = -newVx;
            }

            if (newY < -halfHeight || newY > dimensions.height + halfHeight) {
              newVy = -newVy;
            }

            return {
              ...blob,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              rotation: blob.rotation + blob.rotationSpeed,
            };
          })
        );
      };

      const interval = setInterval(updateBlobPositions, 16);
      return () => clearInterval(interval);
    }
  }, [isClient, dimensions]);

  // Conditionally render only after the client environment is confirmed
  if (!isClient) return null;

  return (
    <svg width="100vw" height="100vh">
      <defs>
        {blobs.map((blob) => (
          <filter
            key={`shadow-${blob.id}`}
            id={`blob-shadow-${blob.id}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={blob.color} floodOpacity="0.8" />
          </filter>
        ))}
      </defs>
      {blobs.map((blob) => (
        <Blob key={blob.id} {...blob} opacity={opacity} />
      ))}
    </svg>
  );
};

export { BlobLayout };
export type { BlobLayoutConfig };
