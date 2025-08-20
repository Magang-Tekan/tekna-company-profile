import { RocketHeroSection } from "@/components/landing/rocket-hero-section";
import { EnhancedFeaturesSection } from "@/components/landing/enhanced-features-section";
import { EnhancedTestimonialsSection } from "@/components/landing/enhanced-testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { PublicLayout } from "@/components/layout/public-layout";

export default function LandingPage() {
  return (
    <PublicLayout>
      <RocketHeroSection />
      <EnhancedFeaturesSection />
      <PricingSection />
      <EnhancedTestimonialsSection />
      <CTASection />
    </PublicLayout>
  );
}