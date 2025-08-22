'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export function HeroSection() {
  const { theme } = useTheme();
  const [contentOpacity, setContentOpacity] = useState({
    content1: 1,
    content2: 0,
    content3: 0
  });

  // Scroll animation handler with smooth sticky transitions
  useEffect(() => {
    let ticking = false;
    
    const updateScrollY = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Content visibility ranges with sticky periods
      const content1Start = 0;
      const content1StickyEnd = viewportHeight * 2.0;    // Content 1 menempel sampai 2vh
      const content1FadeEnd = viewportHeight * 2.5;      // Content 1 selesai fade out
      
      const content2Start = viewportHeight * 2.0;        // Content 2 mulai muncul
      const content2StickyEnd = viewportHeight * 4.5;    // Content 2 menempel sampai 4.5vh  
      const content2FadeEnd = viewportHeight * 5.0;      // Content 2 selesai fade out
      
      const content3Start = viewportHeight * 4.5;        // Content 3 mulai muncul
      const content3StickyEnd = viewportHeight * 7.0;    // Content 3 menempel sampai 7vh
      const content3FadeEnd = viewportHeight * 7.5;      // Content 3 selesai fade out
      
      // Calculate opacity and visibility for each content
      let content1Opacity = 0;
      let content2Opacity = 0;
      let content3Opacity = 0;
      
      // Content 1 logic
      if (currentScrollY >= content1Start && currentScrollY <= content1StickyEnd) {
        content1Opacity = 1; // Fully visible and sticky
      } else if (currentScrollY > content1StickyEnd && currentScrollY <= content1FadeEnd) {
        // Fade out transition
        const fadeProgress = (currentScrollY - content1StickyEnd) / (content1FadeEnd - content1StickyEnd);
        content1Opacity = 1 - fadeProgress;
      }
      
      // Content 2 logic
      if (currentScrollY >= content2Start && currentScrollY <= content2StickyEnd) {
        content2Opacity = 1; // Fully visible and sticky
      } else if (currentScrollY > content2StickyEnd && currentScrollY <= content2FadeEnd) {
        // Fade out transition
        const fadeProgress = (currentScrollY - content2StickyEnd) / (content2FadeEnd - content2StickyEnd);
        content2Opacity = 1 - fadeProgress;
      }
      
      // Content 3 logic
      if (currentScrollY >= content3Start && currentScrollY <= content3StickyEnd) {
        content3Opacity = 1; // Fully visible and sticky
      } else if (currentScrollY > content3StickyEnd && currentScrollY <= content3FadeEnd) {
        // Fade out transition
        const fadeProgress = (currentScrollY - content3StickyEnd) / (content3FadeEnd - content3StickyEnd);
        content3Opacity = 1 - fadeProgress;
      }
      
      // Store opacity values in state
      setContentOpacity({
        content1: content1Opacity,
        content2: content2Opacity,
        content3: content3Opacity
      });
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollY(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Konfigurasi globe yang responsif terhadap tema
  const getGlobeConfig = () => {
    if (theme === 'dark') {
      return {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
      };
    } else {
      // Light theme - warna yang lebih menarik dan kontras
      return {
        pointSize: 4,
        globeColor: "#e2e8f0", // slate-200 - lebih solid dan kontras
        showAtmosphere: true,
        atmosphereColor: "#1e293b", // slate-800 - kontras yang lebih kuat
        atmosphereAltitude: 0.15,
        emissive: "#94a3b8", // slate-400
        emissiveIntensity: 0.2,
        shininess: 0.8,
        polygonColor: "rgba(30, 41, 59, 0.5)", // slate-800 dengan opacity yang lebih tinggi
        ambientLight: "#1e293b", // slate-800
        directionalLeftLight: "#475569", // slate-600
        directionalTopLight: "#334155", // slate-700
        pointLight: "#1e293b", // slate-800
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
      };
    }
  };

  const globeConfig = getGlobeConfig();
  
  // Memoize sampleArcs to prevent Globe reset on content changes
  const sampleArcs = useMemo(() => {
    const colors = theme === 'dark' 
      ? ["#06b6d4", "#3b82f6", "#6366f1"] 
      : ["#1e293b", "#475569", "#64748b"]; // Warna slate yang lebih kontras untuk light theme

    return [
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.1,
        color: colors[0],
      },
      {
        order: 1,
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.2,
        color: colors[1],
      },
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -1.303396,
        endLng: 36.852443,
        arcAlt: 0.5,
        color: colors[2],
      },
      {
        order: 2,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.2,
        color: colors[0],
      },
      {
        order: 2,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.3,
        color: colors[1],
      },
      {
        order: 2,
        startLat: -15.785493,
        startLng: -47.909029,
        endLat: 36.162809,
        endLng: -115.119411,
        arcAlt: 0.3,
        color: colors[2],
      },
      {
        order: 3,
        startLat: -33.8688,
        startLng: 151.2093,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color: colors[0],
      },
      {
        order: 3,
        startLat: 21.3099,
        startLng: -157.8581,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
        color: colors[1],
      },
      {
        order: 3,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[2],
      },
      {
        order: 4,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.5,
        color: colors[0],
      },
      {
        order: 4,
        startLat: -34.6037,
        startLng: -58.3816,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.7,
        color: colors[1],
      },
      {
        order: 4,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.1,
        color: colors[2],
      },
      {
        order: 5,
        startLat: 14.5995,
        startLng: 120.9842,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[0],
      },
      {
        order: 5,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.2,
        color: colors[1],
      },
      {
        order: 5,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.2,
        color: colors[2],
      },
      {
        order: 6,
        startLat: -15.432563,
        startLng: 28.315853,
        endLat: 1.094136,
        endLng: -63.34546,
        arcAlt: 0.7,
        color: colors[0],
      },
      {
        order: 6,
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.1,
        color: colors[1],
      },
      {
        order: 6,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[2],
      },
      {
        order: 7,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.1,
        color: colors[0],
      },
      {
        order: 7,
        startLat: 48.8566,
        startLng: -2.3522,
        endLat: 52.52,
        endLng: 13.405,
        arcAlt: 0.1,
        color: colors[1],
      },
      {
        order: 7,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[2],
      },
      {
        order: 8,
        startLat: -8.833221,
        startLng: 13.264837,
        endLat: -33.936138,
        endLng: 18.436529,
        arcAlt: 0.2,
        color: colors[0],
      },
      {
        order: 8,
        startLat: 49.2827,
        startLng: -123.1207,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.2,
        color: colors[1],
      },
      {
        order: 8,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.5,
        color: colors[2],
      },
      {
        order: 9,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[0],
      },
      {
        order: 9,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.7,
        color: colors[1],
      },
      {
        order: 9,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.5,
        color: colors[2],
      },
      {
        order: 10,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: 28.6139,
        endLng: 77.209,
        arcAlt: 0.7,
        color: colors[0],
      },
      {
        order: 10,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.3,
        color: colors[1],
      },
      {
        order: 10,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.3,
        color: colors[2],
      },
      {
        order: 11,
        startLat: 41.9028,
        startLng: 12.4964,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[0],
      },
      {
        order: 11,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.2,
        color: colors[1],
      },
      {
        order: 11,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 1.3521,
        endLng: 103.8198,
        arcAlt: 0.2,
        color: colors[2],
      },
      {
        order: 12,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 37.7749,
        endLng: -122.4194,
        arcAlt: 0.1,
        color: colors[0],
      },
      {
        order: 12,
        startLat: 35.6762,
        startLng: 139.6503,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.2,
        color: colors[1],
      },
      {
        order: 12,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.3,
        color: colors[2],
      },
      {
        order: 13,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color: colors[0],
      },
      {
        order: 13,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.3,
        color: colors[1],
      },
      {
        order: 13,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.1,
        color: colors[2],
      },
      {
        order: 14,
        startLat: -33.936138,
        startLng: 18.436529,
        endLat: 21.395643,
        endLng: 39.883798,
        arcAlt: 0.3,
        color: colors[0],
      },
    ];
  }, [theme]); // Only recreate when theme changes

  return (
    <>
      {/* Scrollable hero section with sticky content - Extended height for longer content visibility */}
      <section 
        style={{
          height: '800vh', // Increased height to accommodate longer sticky periods
          position: 'relative',
          background: 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)) 50%, hsl(var(--background)))'
        }}
      >
        {/* Sticky container that stays centered during scroll */}
        <div 
          style={{
            position: 'sticky',
            top: '50vh',
            transform: 'translateY(-50%)',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          {/* Globe Background - Always visible and centered */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <div style={{ width: '120vw', height: '120vh', position: 'relative' }}>
              <World data={sampleArcs} globeConfig={globeConfig} />
            </div>
          </div>
          
          {/* Content 1 - Initial Hero Text with smooth sticky transition */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4"
            style={{
              opacity: contentOpacity.content1,
              transform: `translateY(${contentOpacity.content1 === 1 ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out' // Faster response to scroll
            }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              With Tekna
              <br />
              Serving The Universe
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Building scalable websites, mobile apps, and IoT solutions for the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/projects">Portfolio</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link href="/contact">Reach Us</Link>
              </Button>
            </div>
          </motion.div>

          {/* Content 2 - Our Services with smooth sticky transition */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4"
            style={{
              opacity: contentOpacity.content2,
              transform: `translateY(${contentOpacity.content2 === 1 ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out' // Faster response to scroll
            }}
          >
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              Innovation Meets
              <br />
              Excellence
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              From concept to deployment, we deliver cutting-edge technology solutions that transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            </div>
          </motion.div>

          {/* Content 3 - Global Reach with smooth sticky transition */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4"
            style={{
              opacity: contentOpacity.content3,
              transform: `translateY(${contentOpacity.content3 === 1 ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out' // Faster response to scroll
            }}
          >
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              Connected Across
              <br />
              Continents
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Our global network ensures seamless collaboration and support wherever you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}