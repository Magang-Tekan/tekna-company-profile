"use client";

import { useEffect } from "react";

export function GlobePreloader() {
  useEffect(() => {
    // Lightweight preloading - only critical resources
    const preloadCriticalResources = async () => {
      // Preload only the most critical resources
      const threeModule = import("three");
      const threeGlobeModule = import("three-globe");
      const globeDataModule = import("@/data/globe.json");
      
      // Don't wait for all - just start the downloads
      Promise.all([threeModule, threeGlobeModule, globeDataModule]).catch(() => {
        // Silent fail - globe will still work
      });
    };

    // Start preloading immediately for instant globe
    preloadCriticalResources();
  }, []);

  return null; // This component doesn't render anything
}
