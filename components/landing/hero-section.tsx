'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket3D } from "./rocket-3d";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Langsung buat animasi tanpa fromTo, cukup to() saja
      gsap.to(textRef.current, {
        y: "200vh",
        opacity: 0,
        scale: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top", 
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Fixed Rocket - Always centered in viewport */}
      <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
        <Rocket3D />
      </div>

      {/* Hero Section Content - Normal scroll flow */}
      <section 
        ref={sectionRef}
        className="relative w-full h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center z-20"
      >
        {/* Text Content - Will move down with parallax */}
        <div 
          ref={textRef}
          className="text-center max-w-4xl px-4 pointer-events-auto bg-background/70 backdrop-blur-sm rounded-lg p-8"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
            Membangun Masa Depan Digital, Bersama
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Kami adalah agensi digital yang bersemangat dalam menciptakan solusi inovatif dan pengalaman pengguna yang luar biasa melalui teknologi dan desain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/projects">Lihat Portofolio</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>

      </section>

      {/* Spacer for scroll effect */}
      <div className="h-screen bg-gradient-to-b from-background/80 to-background"></div>
    </>
  );
}