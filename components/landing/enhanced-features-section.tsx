'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Code, 
  Rocket, 
  Smartphone, 
  Globe, 
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const features = [
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Desain UI/UX Modern",
    description: "Antarmuka yang tidak hanya indah secara visual tetapi juga intuitif dan ramah pengguna.",
    benefits: ["Figma Design System", "Responsive Design", "User Research", "Prototyping"],
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Pengembangan Full-Stack", 
    description: "Teknologi web terbaru untuk membangun aplikasi yang cepat, aman, dan dapat diskalakan.",
    benefits: ["Next.js 15", "TypeScript", "Supabase", "Tailwind CSS"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Strategi Digital",
    description: "Dari SEO hingga manajemen konten, membangun kehadiran online yang kuat.",
    benefits: ["SEO Optimization", "Content Strategy", "Analytics", "Performance"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile-First Approach",
    description: "Aplikasi yang optimal di semua perangkat dengan performa tinggi.",
    benefits: ["PWA", "React Native", "Cross-Platform", "App Store"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Cloud Infrastructure",
    description: "Solusi cloud yang scalable dan reliable untuk kebutuhan bisnis modern.",
    benefits: ["AWS/Vercel", "Auto Scaling", "CDN", "Monitoring"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Security & Performance",
    description: "Keamanan tingkat enterprise dengan performa yang optimal.",
    benefits: ["SSL/TLS", "Authentication", "Rate Limiting", "Caching"],
    color: "from-teal-500 to-cyan-500"
  }
];

const stats = [
  { icon: <Zap className="w-6 h-6" />, label: "Faster Load Time", value: "90%" },
  { icon: <Users className="w-6 h-6" />, label: "Client Satisfaction", value: "98%" },
  { icon: <CheckCircle className="w-6 h-6" />, label: "Project Success", value: "100%" }
];

export function EnhancedFeaturesSection() {
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (inView && cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { 
          y: 60,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [inView]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Layanan Unggulan
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Solusi{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Lengkap
            </span>{" "}
            untuk Bisnis Digital
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Kami menyediakan berbagai layanan untuk membantu bisnis Anda berkembang di era digital
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
              <div className="relative bg-background m-0.5 rounded-lg h-full">
                <CardHeader className="pb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 w-fit`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 group/btn"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
          <Card className="relative bg-gradient-to-r from-background/95 to-muted/95 backdrop-blur-sm border-0">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Mengapa Memilih Kami?
                </h3>
                <p className="text-muted-foreground">
                  Track record yang terbukti dalam menghasilkan solusi digital berkualitas tinggi
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
