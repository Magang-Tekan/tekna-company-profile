'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export function RocketHeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([]);

  useEffect(() => {
    // GSAP ScrollTrigger setup
    if (typeof window !== 'undefined' && heroRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      tl.to(".hero-content", {
        y: -50,
        opacity: 0.8,
        ease: "none"
      });
    }

    // Generate particle styles on client-side only
    const generatedStyles: ParticleStyle[] = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }));
    setParticleStyles(generatedStyles);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20"
    >
      {/* Background 3D placeholder */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <div className="w-96 h-96 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-bounce" 
             style={{ animationDuration: '3s' }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60 pointer-events-none" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particleStyles.map((style, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={style}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="hero-content max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Inovasi Digital Terdepan
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Membangun
            </span>
            <span className="block mt-2">
              Masa Depan
            </span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Digital
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kami adalah agensi digital yang bersemangat dalam menciptakan{" "}
            <span className="text-primary font-semibold">solusi inovatif</span>{" "}
            dan pengalaman pengguna yang luar biasa melalui teknologi dan desain.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/projects">
                Lihat Portofolio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 hover:bg-primary/5 backdrop-blur-sm"
            >
              <Link href="#contact">
                Hubungi Kami
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Proyek Selesai", value: "50+" },
              { label: "Klien Puas", value: "30+" },
              { label: "Tahun Pengalaman", value: "5+" },
              { label: "Tim Ahli", value: "10+" }
            ].map((stat, index) => (
              <div key={`stat-${index}`} className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}