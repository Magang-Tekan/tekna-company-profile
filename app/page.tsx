import { HeroSection } from "@/components/landing/hero-section";
import { ProjectsSection } from "@/components/landing/projects-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { AppHeader } from "@/components/layout/public-header";
import { GlobeBackground } from "@/components/ui/globe-background";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header overlay for landing page */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <AppHeader />
      </div>
      
      {/* Globe Background - Fixed dan terlihat di semua section */}
      <GlobeBackground />
      
      {/* Main content with sticky hero and overlapping sections */}
      <main className="flex-1 relative z-20">
        <HeroSection />
        <ProjectsSection />
        <TestimonialsSection />
      </main>
      
      <footer className="bg-background/90 backdrop-blur-sm border-t relative z-30">
        <div className="container mx-auto px-4 md:px-6 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tekna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}