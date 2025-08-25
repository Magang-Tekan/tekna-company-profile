'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [contentOpacity, setContentOpacity] = useState({
    content1: 1,
    content2: 0,
    content3: 0
  });

  // Scroll animation handler for sticky hero content transitions
  useEffect(() => {
    let ticking = false;
    
    const updateScrollY = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Define transition ranges for sticky hero content
      const content1End = viewportHeight * 0.8;     // Content 1 visible until 80vh scroll
      const content2Start = viewportHeight * 0.6;   // Content 2 starts appearing at 60vh
      const content2End = viewportHeight * 1.6;     // Content 2 visible until 160vh scroll
      const content3Start = viewportHeight * 1.4;   // Content 3 starts appearing at 140vh
      const content3End = viewportHeight * 2.4;     // Content 3 visible until 240vh scroll
      
      // Calculate opacity for each content section
      let content1Opacity = 0;
      let content2Opacity = 0;
      let content3Opacity = 0;
      
      // Content 1 logic - starts visible, fades out
      if (currentScrollY <= content1End) {
        content1Opacity = 1;
      } else {
        content1Opacity = Math.max(0, 1 - (currentScrollY - content1End) / (viewportHeight * 0.4));
      }
      
      // Content 2 logic - fades in then out
      if (currentScrollY >= content2Start && currentScrollY <= content2End) {
        if (currentScrollY < content1End) {
          // Fade in
          content2Opacity = (currentScrollY - content2Start) / (content1End - content2Start);
        } else if (currentScrollY > content2End - viewportHeight * 0.4) {
          // Fade out
          content2Opacity = Math.max(0, 1 - (currentScrollY - (content2End - viewportHeight * 0.4)) / (viewportHeight * 0.4));
        } else {
          // Fully visible
          content2Opacity = 1;
        }
      }
      
      // Content 3 logic - fades in and stays visible longer
      if (currentScrollY >= content3Start) {
        if (currentScrollY < content3End) {
          content3Opacity = Math.min(1, (currentScrollY - content3Start) / (viewportHeight * 0.4));
        } else {
          // Fade out when projects section is near
          content3Opacity = Math.max(0, 1 - (currentScrollY - content3End) / (viewportHeight * 0.3));
        }
      }
      
      // Update state with calculated opacities
      setContentOpacity({
        content1: Math.max(0, Math.min(1, content1Opacity)),
        content2: Math.max(0, Math.min(1, content2Opacity)),
        content3: Math.max(0, Math.min(1, content3Opacity))
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

  return (
    <>
      {/* Hero section with sticky content that stays centered */}
      <section 
        className="relative"
        style={{
          height: '400vh', // Increased height for better sticky effect
          background: 'transparent' // Buat background transparan
        }}
      >
        {/* Sticky container that remains centered during scroll */}
        <div 
          className="sticky top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none"
          style={{
            zIndex: 40, // Higher than projects section to stay visible
            background: 'transparent' // Pastikan container juga transparan
          }}
        >
          {/* Content 1 - Initial Hero Text with smooth transitions */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4 pointer-events-none"
            style={{
              opacity: contentOpacity.content1,
              transform: `translateY(${contentOpacity.content1 === 1 ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out'
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
              <Button asChild size="lg" className="text-lg px-8 py-6 pointer-events-auto">
                <Link href="/projects">Portfolio</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 pointer-events-auto">
                <Link href="/contact">Reach Us</Link>
              </Button>
            </div>
          </motion.div>

          {/* Content 2 - Our Services with smooth transitions */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4 pointer-events-none"
            style={{
              opacity: contentOpacity.content2,
              transform: `translateY(${contentOpacity.content2 === 1 ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out'
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
          </motion.div>

          {/* Content 3 - Featured Projects with smooth transitions */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4 pointer-events-none"
            style={{
              opacity: contentOpacity.content3,
              transform: `translateY(${contentOpacity.content3 === 1 ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out'
            }}
          >
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              Featured Projects             
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore our latest projects and see how we&apos;ve transformed businesses across industries.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}