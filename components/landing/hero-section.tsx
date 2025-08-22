'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/50 to-background">
      {/* Hero Content */}
      <div className="text-center max-w-4xl px-4">
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
            <Link href="/projects">Portofolio</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
            <Link href="/contact">Reach Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}