'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MessageCircle,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CTASection() {
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && contentRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(contentRef.current.children,
        { 
          y: 60,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [inView]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-30 w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-30 left-40 w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div ref={contentRef} className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div>
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Siap Memulai Proyek?
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Mari{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Wujudkan
              </span>{" "}
              Visi Digital Anda
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Konsultasikan ide Anda dengan tim ahli kami. Kami siap membantu mewujudkan solusi digital yang tepat untuk bisnis Anda.
            </p>
          </div>

          {/* Main CTA Card */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
            <CardContent className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Text content */}
                <div className="text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Konsultasi Gratis</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Mulai Konsultasi Gratis Hari Ini
                  </h3>
                  <p className="text-muted-foreground">
                    Dapatkan analisis mendalam tentang kebutuhan digital bisnis Anda dan rekomendasi solusi terbaik dari tim expert kami.
                  </p>
                  
                  {/* Contact options */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+62 812-3456-7890</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>hello@tekna.digital</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Jakarta, Indonesia</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      asChild 
                      size="lg" 
                      className="w-full group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="#contact">
                        <Calendar className="w-5 h-5 mr-2" />
                        Jadwalkan Konsultasi
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild 
                      size="lg" 
                      variant="outline" 
                      className="w-full group border-2 hover:bg-primary/5"
                    >
                      <Link href="/projects">
                        Lihat Portfolio
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>

                    <Button 
                      asChild 
                      size="lg" 
                      variant="ghost" 
                      className="w-full group"
                    >
                      <Link href="https://wa.me/6281234567890" target="_blank">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp Sekarang
                      </Link>
                    </Button>
                  </div>

                  {/* Newsletter signup */}
                  <div className="pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-3">
                      Dapatkan tips dan insight terbaru tentang teknologi digital
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Email Anda" 
                        className="flex-1"
                      />
                      <Button size="sm">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom text */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Sudah dipercaya oleh 30+ perusahaan di Indonesia
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {[
                "Startup", "Enterprise", "SME", "Agency"
              ].map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
