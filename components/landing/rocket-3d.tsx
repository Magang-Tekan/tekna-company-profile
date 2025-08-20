'use client';
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import { Suspense, useEffect, useState, memo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

// Extend Three.js objects for React Three Fiber
extend(THREE);

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RocketViewerProps {
  src: string;
  enableInteraction?: boolean;
  enableRotation?: boolean;
  theme?: "light" | "dark";
  onLoad?: () => void;
  animationProgress?: number;
}

interface ModelProps {
  src: string;
  onLoad?: () => void;
  animationProgress?: number;
}

const Model: React.FC<ModelProps> = memo(
  ({ src, onLoad, animationProgress = 0 }) => {
    const { scene } = useGLTF(src);
    const modelRef = useRef<THREE.Group>(null);
    
    useEffect(() => {
      if (onLoad) onLoad();
    }, [scene, onLoad]);

    // Continuous animation based on scroll progress throughout entire page
    useFrame(() => {
      if (modelRef.current) {
        // CONTINUOUS rotation - multiple rotations throughout entire scroll
        // animationProgress goes from 0 to 1 for entire page, so multiply for more rotations
        modelRef.current.rotation.y = Math.PI / 4 + (animationProgress * Math.PI * 8); // 4 full rotations
        
        // CONTINUOUS floating effect - multiple wave cycles throughout scroll
        const scrollFloat = Math.sin(animationProgress * Math.PI * 6) * 0.3; // 3 float cycles
        modelRef.current.position.y = scrollFloat;
        
        // Progressive forward movement throughout scroll
        modelRef.current.position.z = animationProgress * 0.5;
        
        // FIXED scale - no zoom-dependent scaling to maintain consistent size
        const baseScale = 1.8; // Fixed base scale
        const scrollScale = animationProgress * 0.2; // Minimal scroll-based scaling
        const finalScale = baseScale + scrollScale;
        modelRef.current.scale.set(finalScale, finalScale, finalScale);
      }
    });

    return (
      <group ref={modelRef}>
        <primitive
          // @ts-expect-error Three.js primitive props
          object={scene}
          // @ts-expect-error Three.js primitive props
          rotation={[0, 0, 0]}
          // @ts-expect-error Three.js primitive props
          scale={[1.8, 1.8, 1.8]}
        />
      </group>
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
    animationProgress = 0,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const getLightIntensity = () => {
      switch (theme) {
        case "light":
          return { 
            ambient: 5.0,      // Sangat terang
            directional: 2.5,  // Cahaya utama sangat kuat
            fill: 2.0,         // Fill light kuat
            rim: 1.5,          // Rim light kuat
            side: 1.8          // Cahaya samping kuat
          };
        case "dark":
          return { 
            ambient: 2.0,      // Lebih terang dari sebelumnya
            directional: 2.0,  
            fill: 1.5,         
            rim: 1.2,          
            side: 1.4          
          };
        default:
          return { 
            ambient: 3.5,      // Default sangat terang
            directional: 2.2,  
            fill: 1.8,         
            rim: 1.3,          
            side: 1.6          
          };
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
          overflow: "visible",
        }}
        shadows={false}
        camera={{
          position: [0, 0, 4],
          fov: 45, // Fixed FOV for consistent perspective
          near: 0.1,
          far: 1000,
          zoom: 1, // Fixed zoom level
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={1} // Fixed device pixel ratio to prevent scaling issues
        performance={{ min: 0.5 }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }} // Disable auto-resize
      >
        {/* Ambient light - cahaya dasar yang sangat terang */}
        <ambientLight intensity={lightIntensity.ambient} />
        
        {/* Directional light utama - sangat kuat */}
        <directionalLight
          position={[3, 4, 3]}
          intensity={lightIntensity.directional}
          castShadow={false}
        />
        
        {/* Fill light kiri - mengisi bayangan */}
        <directionalLight
          position={[-4, 3, 2]}
          intensity={lightIntensity.fill}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Fill light kanan */}
        <directionalLight
          position={[4, 3, 2]}
          intensity={lightIntensity.fill}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Back light - menerangi dari belakang */}
        <directionalLight
          position={[0, 3, -4]}
          intensity={lightIntensity.fill}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Front light - tambahan dari depan */}
        <directionalLight
          position={[0, 2, 4]}
          intensity={lightIntensity.fill}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Side lights - kiri dan kanan */}
        <directionalLight
          position={[-4, 0, 0]}
          intensity={lightIntensity.side}
          color="#ffffff"
          castShadow={false}
        />
        
        <directionalLight
          position={[4, 0, 0]}
          intensity={lightIntensity.side}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Top light - dari atas */}
        <directionalLight
          position={[0, 6, 0]}
          intensity={lightIntensity.fill}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Bottom light - dari bawah */}
        <directionalLight
          position={[0, -4, 0]}
          intensity={lightIntensity.fill}
          color="#ffffff"
          castShadow={false}
        />
        
        {/* Corner lights - sudut-sudut */}
        <directionalLight
          position={[3, 3, -3]}
          intensity={lightIntensity.rim}
          color="#ffffff"
          castShadow={false}
        />
        
        <directionalLight
          position={[-3, 3, -3]}
          intensity={lightIntensity.rim}
          color="#ffffff"
          castShadow={false}
        />
        
        <directionalLight
          position={[3, -3, 3]}
          intensity={lightIntensity.rim}
          color="#ffffff"
          castShadow={false}
        />
        
        <directionalLight
          position={[-3, -3, 3]}
          intensity={lightIntensity.rim}
          color="#ffffff"
          castShadow={false}
        />

        <Suspense fallback={null}>
          <Model src={src} onLoad={handleModelLoad} animationProgress={animationProgress} />
          {(enableInteraction || enableRotation) && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={enableRotation}
              minDistance={3}
              maxDistance={8}
              autoRotate={false}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup GSAP ScrollTrigger for continuous rocket animation throughout the entire page
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body", // Trigger on entire page scroll
        start: "top top",
        end: "max", // Animate throughout the ENTIRE page height
        scrub: 1, // Smooth 1:1 scrubbing with scroll
        onUpdate: (self) => {
          // Animation progress from 0 to 1 throughout entire page scroll
          setAnimationProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="overflow-visible"
      style={{
        width: '50vmin', // Fixed size based on viewport minimum dimension
        height: '50vmin', // Square aspect ratio, scales with viewport but consistent
        minWidth: '300px', // Minimum size to prevent too small on mobile
        minHeight: '300px',
        maxWidth: '500px', // Maximum size to prevent too large on desktop
        maxHeight: '500px',
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <RocketViewer
          src="/rocket.glb"
          enableRotation={false}
          enableInteraction={false}
          theme="light"
          animationProgress={animationProgress}
        />
      </Suspense>
    </div>
  );
}