import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PublicLayout } from "@/components/layout/public-layout";

export default function LandingPage() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
    </PublicLayout>
  );
}