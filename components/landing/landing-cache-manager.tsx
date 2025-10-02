"use client";

import { useLandingCacheManager } from '@/hooks/use-landing-data';

/**
 * Komponen untuk mengelola cache dan cleanup landing page
 * Ditempatkan di root layout atau landing page
 */
export function LandingCacheManager() {
  useLandingCacheManager();
  
  return null; // Komponen tidak render apapun
}
