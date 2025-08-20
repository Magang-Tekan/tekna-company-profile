import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { AppHeader } from "@/components/layout/public-header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/50 to-background">
      {/* Header overlay khusus untuk landing page - tidak mengganggu scroll flow */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-transparent">
        <AppHeader />
      </div>
      
      {/* Content tanpa layout wrapper */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 md:px-6 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tekna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}