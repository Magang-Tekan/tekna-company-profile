'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import { Suspense, useEffect, useState, memo } from "react";

interface RocketViewerProps {
  src: string;
  enableInteraction?: boolean;
  enableRotation?: boolean;
  theme?: "light" | "dark";
  onLoad?: () => void;
}

const Model: React.FC<{ src: string; onLoad?: () => void }> = memo(
  ({ src, onLoad }) => {
    const { scene } = useGLTF(src);

    useEffect(() => {
      if (onLoad) onLoad();
    }, [scene, onLoad]);

    return (
      <primitive
        object={scene}
        rotation={[0, Math.PI / 4, 0]}
        scale={[2.5, 2.5, 2.5]}
      />
    );
  },
);

Model.displayName = "Model";

// Preload rocket model
useGLTF.preload("/rocket.glb");

const RocketViewer: React.FC<Readonly<RocketViewerProps>> = memo(
  ({
    src,
    enableInteraction = true,
    enableRotation = true,
    theme = "light",
    onLoad,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const getLightIntensity = () => {
      switch (theme) {
        case "light":
          return { ambient: 1.5, directional: 0.8 };
        case "dark":
          return { ambient: 0.4, directional: 0.6 };
        default:
          return { ambient: 0.8, directional: 0.7 };
      }
    };

    const lightIntensity = getLightIntensity();

    const handleModelLoad = () => {
      setIsLoaded(true);
      if (onLoad) {
        onLoad();
      }
    };

    return (
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          opacity: isLoaded ? 1 : 0.3,
          transition: "opacity 0.3s ease-in-out",
          background: "transparent",
          position: "relative",
          overflow: "hidden",
        }}
        shadows={false}
        camera={{
          position: [0, 0, 4],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={lightIntensity.ambient} />
        <directionalLight
          position={[3, 4, 3]}
          intensity={lightIntensity.directional}
          castShadow={false}
        />

        <Suspense fallback={null}>
          <Model src={src} onLoad={handleModelLoad} />
          {(enableInteraction || enableRotation) && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={enableRotation}
              minDistance={3}
              maxDistance={8}
              autoRotate={enableRotation}
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI * 0.65}
              minPolarAngle={Math.PI * 0.2}
              target={[0, 0, 0]}
            />
          )}
          <Preload all />
        </Suspense>
      </Canvas>
    );
  },
);

RocketViewer.displayName = "RocketViewer";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  );
}

export function Rocket3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Suspense fallback={<LoadingSpinner />}>
        <RocketViewer 
          src="/rocket.glb"
          enableRotation={true}
          enableInteraction={false}
          theme="light"
        />
      </Suspense>
    </div>
  );
}
