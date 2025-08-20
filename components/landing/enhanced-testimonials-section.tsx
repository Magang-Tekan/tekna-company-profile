'use client';

import { getFeaturedTestimonialsAction } from "@/app/actions/public";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Testimonial {
  id: string;
  testimonial_translations: { content: string }[];
  client_name: string;
  client_position: string;
  client_company: string;
  client_avatar_url: string | null;
  rating?: number;
}

export function EnhancedTestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await getFeaturedTestimonialsAction();
        
        // Add mock ratings and enhance data for better presentation
        const enhancedData = data.map(testimonial => ({
          ...testimonial,
          rating: 5 // Mock rating - you can add this to your database
        }));
        
        setTestimonials(enhancedData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback mock data for demo
        setTestimonials([
          {
            id: '1',
            testimonial_translations: [{ content: 'Tim Tekna sangat profesional dan menghasilkan website yang luar biasa. Kualitas kerja mereka melampaui ekspektasi kami.' }],
            client_name: 'Budi Santoso',
            client_position: 'CEO',
            client_company: 'Tech Startup Indonesia',
            client_avatar_url: null,
            rating: 5
          },
          {
            id: '2',
            testimonial_translations: [{ content: 'Proses pengembangan aplikasi mobile berjalan sangat lancar. Komunikasi yang baik dan hasil yang memuaskan.' }],
            client_name: 'Sarah Williams',
            client_position: 'Product Manager',
            client_company: 'Digital Agency',
            client_avatar_url: null,
            rating: 5
          },
          {
            id: '3',
            testimonial_translations: [{ content: 'Desain yang modern dan fungsionalitas yang sempurna. Highly recommended untuk proyek digital apapun.' }],
            client_name: 'Ahmad Rizki',
            client_position: 'Founder',
            client_company: 'E-commerce Platform',
            client_avatar_url: null,
            rating: 5
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (inView && cardsRef.current.length > 0 && !loading) {
      gsap.fromTo(cardsRef.current,
        { 
          y: 80,
          opacity: 0,
          rotateX: 15
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }
  }, [inView, loading]);

  if (loading || testimonials.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-lg w-64 mx-auto mb-4" />
              <div className="h-12 bg-muted rounded-lg w-96 mx-auto mb-8" />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Testimoni Klien
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Apa Kata{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Klien Kami
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Kepuasan klien adalah prioritas utama kami. Dengarkan pengalaman mereka bekerja sama dengan tim Tekna.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-1"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="relative bg-background/95 backdrop-blur-sm m-0.5 rounded-lg h-full">
                <CardContent className="p-8">
                  {/* Quote icon */}
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="w-8 h-8 text-primary/60" />
                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Testimonial text */}
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.testimonial_translations?.[0]?.content || 'No testimonial available'}&rdquo;
                  </blockquote>
                  
                  {/* Client info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src={testimonial.client_avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.client_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {testimonial.client_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {testimonial.client_position}
                      </p>
                      <p className="text-xs text-primary font-medium truncate">
                        {testimonial.client_company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                <div 
                  key={`trust-avatar-${letter}`} 
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              +30 klien puas dengan layanan kami
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
