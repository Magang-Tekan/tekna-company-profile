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

    // Update model SUBTLE animation based on scroll progress
    useFrame(() => {
      if (modelRef.current) {
        // GENTLE rotation based on scroll progress
        modelRef.current.rotation.y = Math.PI / 4 + (animationProgress * Math.PI * 2);
        
        // SUBTLE floating effect based on scroll progress
        const scrollFloat = Math.sin(animationProgress * Math.PI * 2) * 0.15;
        modelRef.current.position.y = scrollFloat;
        
        // MINIMAL forward movement
        modelRef.current.position.z = animationProgress * 0.2;
        
        // STABLE scale - almost no change
        const scale = 1.8 + (animationProgress * 0.05);
        modelRef.current.scale.set(scale, scale, scale);
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

    // Setup GSAP ScrollTrigger for rocket animation - SLOW and subtle
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body", // Trigger on whole page scroll
        start: "top top",
        end: "+=200vh", // Longer duration for slower animation
        scrub: 0.5, // SLOWER scrub for rocket (text uses scrub: 2)
        onUpdate: (self) => {
          setAnimationProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
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