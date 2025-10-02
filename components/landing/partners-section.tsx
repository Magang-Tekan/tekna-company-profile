"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur';

interface Partner {
  id: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/partners?limit=20");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.partners && Array.isArray(data.partners)) {
          // Filter partners yang memiliki logo_url
          const validPartners = data.partners.filter(
            (partner: Partner) => partner.logo_url && partner.logo_url.trim() !== ""
          );
          setPartners(validPartners);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    // Delay fetching to prioritize FCP
    const timer = setTimeout(fetchPartners, 200);
    return () => clearTimeout(timer);
  }, []);

  const skeletonIds = [
    "sk-0",
    "sk-1",
    "sk-2",
    "sk-3",
    "sk-4",
    "sk-5",
    "sk-6",
    "sk-7",
  ];

  // Show minimal loading state or hide completely during loading
  if (loading) {
    return null; // Hide loading state for instant FCP
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 md:py-24 relative z-30">
      <div className="group relative m-auto max-w-6xl px-6">
        {/* Background overlay untuk memastikan tidak ada overlap dengan globe */}
        <div className="absolute inset-0 bg-background -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-center relative z-10">
          {/* Mobile: Title di atas, Desktop: Title di kiri */}
          <div className="w-full md:w-auto md:max-w-44 md:border-r md:border-border md:pr-6 mb-6 md:mb-0">
            <p className="text-center md:text-end text-sm text-muted-foreground">Trusted by industry leaders</p>
          </div>
          
          <div className="relative py-6 w-full md:w-[calc(100%-11rem)]">
            {/* Mobile: Sederhana tanpa gradient dan blur */}
            <div className="md:hidden">
              <div className="overflow-hidden px-4">
                <InfiniteSlider
                  speedOnHover={30}
                  speed={50}
                  gap={64}>
                  {partners.map((partner) => (
                    <div key={partner.id} className="flex items-center justify-center">
                      <div className="relative h-16 w-32 md:h-24 md:w-64">
                        <Image
                          className="object-contain dark:invert filter grayscale hover:grayscale-0 transition-all duration-300"
                          src={partner.logo_url}
                          alt={`Partner Logo`}
                          fill
                          sizes="(max-width: 768px) 128px, 256px"
                        />
                      </div>
                    </div>
                  ))}
                </InfiniteSlider>
              </div>
            </div>

            {/* Desktop: Dengan gradient dan blur effects */}
            <div className="hidden md:block">
              <div className="overflow-hidden px-8">
                <InfiniteSlider
                  speedOnHover={20}
                  speed={40}
                  gap={128}>
                  {partners.map((partner) => (
                    <div key={partner.id} className="flex items-center justify-center">
                      <div className="relative h-24 w-64">
                        <Image
                          className="object-contain dark:invert filter grayscale hover:grayscale-0 transition-all duration-300"
                          src={partner.logo_url}
                          alt={`Partner Logo`}
                          fill
                          sizes="256px"
                        />
                      </div>
                    </div>
                  ))}
                </InfiniteSlider>
              </div>

              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent"></div>
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
