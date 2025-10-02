"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Group } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: () => ThreeGlobe;
  }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  readonly globeConfig: GlobeConfig;
  readonly data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'shape' | 'data' | 'animations' | 'complete'>('shape');

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(16, 185, 129, 0.8)", // emerald-500 - daratan neon
    globeColor: "#bfdbfe", // blue-200 - lautan terang
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  // Simplified globe initialization for better performance
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current?.add(globeRef.current);
      
      // Set basic globe properties with reduced complexity
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(2) // Reduced resolution for better performance
        .hexPolygonMargin(0.8)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);
      
      setIsInitialized(true);
      setLoadingStage('data');
    }
  }, [defaultProps.showAtmosphere, defaultProps.atmosphereColor, defaultProps.atmosphereAltitude, defaultProps.polygonColor]);

  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  // Simplified data loading for better performance
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data || loadingStage !== 'data') return;

    // Simplified points creation
    const points = data.slice(0, 10).map(arc => ({
      size: defaultProps.pointSize,
      order: arc.order,
      color: arc.color,
      lat: arc.startLat,
      lng: arc.startLng,
    }));

    // Add simplified arcs data
    if (globeRef.current) {
      globeRef.current
        .arcsData(data.slice(0, 20)) // Limit arcs for better performance
        .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
        .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
        .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
        .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
        .arcColor((e: Position) => e.color)
        .arcAltitude((e) => (e as { arcAlt: number }).arcAlt * 1)
        .arcStroke(() => 0.3)
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((e) => (e as { order: number }).order * 1)
        .arcDashGap(20)
        .arcDashAnimateTime(() => defaultProps.arcTime);

      // Add simplified points data
      globeRef.current
        .pointsData(points)
        .pointColor((e) => (e as { color: string }).color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(1.5);

      // Simplified rings data
      globeRef.current
        .ringsData([])
        .ringColor(() => defaultProps.polygonColor)
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
        );
    }

    setLoadingStage('animations');
  }, [
    isInitialized,
    data,
    loadingStage,
    defaultProps.pointSize,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
    defaultProps.polygonColor,
  ]);

  // Simplified animations for better performance
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data || loadingStage !== 'animations') return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      // Simplified rings animation
      const newNumbersOfRings = genRandomNumbers(
        0,
        Math.min(data.length, 10), // Limit rings for better performance
        Math.floor(Math.min(data.length, 10) * 0.6)
      );

      const ringsData = data
        .slice(0, 10) // Limit data for better performance
        .filter((d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }));

      globeRef.current.ringsData(ringsData);
    }, 3000); // Slower animation for better performance

    setLoadingStage('complete');
    return () => {
      clearInterval(interval);
    };
  }, [isInitialized, data, loadingStage]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    // Optimized renderer settings for better performance
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size.width, size.height]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;

  // Optimized scene and camera for better performance
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  // Create scene and camera only once with optimized settings
  sceneRef.current ??= new Scene();
  sceneRef.current.fog = new Fog(0xffffff, 400, 2000);

  cameraRef.current ??= new PerspectiveCamera(50, aspect, 180, 1800);
  cameraRef.current.position.z = cameraZ;

  return (
    <Canvas
      scene={sceneRef.current}
      camera={cameraRef.current}
      style={{ pointerEvents: "auto" }}
      dpr={[1, 2]} // Limit device pixel ratio for better performance
      performance={{ min: 0.5 }} // Optimize for performance
      gl={{ antialias: false, alpha: false }} // Disable antialiasing for better performance
      frameloop="demand" // Only render when needed
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0); // Transparent background
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
      }}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
      />
      <pointLight
        color={globeConfig.pointLight}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={0.5} // Slower rotation for better performance
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
        enabled={true}
        enableDamping={true} // Smoother rotation
        dampingFactor={0.1}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
