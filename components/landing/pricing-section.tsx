'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const pricingPlans = [
  {
    name: "Starter",
    icon: <Zap className="w-6 h-6" />,
    price: "15jt",
    duration: "per proyek",
    description: "Perfect untuk startup dan bisnis kecil yang ingin memulai kehadiran digital",
    features: [
      "Landing Page Responsive",
      "Desain UI/UX Modern",
      "SEO Basic",
      "Mobile Optimization",
      "Form Kontak",
      "Google Analytics",
      "SSL Certificate",
      "Support 30 hari"
    ],
    popular: false,
    color: "from-green-500 to-emerald-500",
    buttonText: "Mulai Sekarang"
  },
  {
    name: "Professional", 
    icon: <Star className="w-6 h-6" />,
    price: "35jt",
    duration: "per proyek",
    description: "Solusi lengkap untuk bisnis yang ingin mengembangkan aplikasi web modern",
    features: [
      "Website Multi-halaman",
      "CMS & Admin Panel",
      "Database Integration",
      "User Authentication",
      "Payment Gateway",
      "Advanced SEO",
      "Performance Optimization",
      "Support 90 hari",
      "Training & Documentation"
    ],
    popular: true,
    color: "from-blue-500 to-cyan-500",
    buttonText: "Pilihan Terpopuler"
  },
  {
    name: "Enterprise",
    icon: <Crown className="w-6 h-6" />,
    price: "75jt+",
    duration: "per proyek",
    description: "Solusi kustomisasi penuh untuk perusahaan besar dengan kebutuhan kompleks",
    features: [
      "Full-Stack Application",
      "Microservices Architecture",
      "Cloud Infrastructure",
      "Advanced Security",
      "API Development",
      "Third-party Integrations",
      "Load Balancing",
      "24/7 Support",
      "Dedicated Team",
      "Custom Features"
    ],
    popular: false,
    color: "from-purple-500 to-indigo-500", 
    buttonText: "Konsultasi Custom"
  }
];

const additionalServices = [
  { name: "Mobile App Development", price: "25jt+" },
  { name: "E-commerce Platform", price: "45jt+" },
  { name: "Digital Marketing", price: "5jt/bulan" },
  { name: "Maintenance & Support", price: "2jt/bulan" }
];

export function PricingSection() {
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (inView && cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { 
          y: 80,
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            <Rocket className="w-4 h-4 mr-2" />
            Paket Layanan
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Pilih Paket yang{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Tepat
            </span>{" "}
            untuk Anda
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Solusi fleksibel yang disesuaikan dengan kebutuhan dan budget bisnis Anda
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-xl scale-105' 
                  : 'border-border hover:shadow-lg'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1">
                    Paling Populer
                  </Badge>
                </div>
              )}

              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
              
              <div className="relative bg-background m-0.5 rounded-lg h-full">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} text-white mb-4 w-fit mx-auto`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {plan.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    asChild
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href="#contact">
                      {plan.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Layanan Tambahan</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-medium text-sm mb-2">{service.name}</p>
                <p className="text-primary font-bold">{service.price}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-muted-foreground text-sm mb-4">
              Butuh paket custom? Kami siap membantu Anda
            </p>
            <Button asChild variant="outline">
              <Link href="#contact">
                Konsultasi Gratis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
