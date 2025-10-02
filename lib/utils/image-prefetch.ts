/**
 * Utility functions for image prefetching to improve loading performance
 */

/**
 * Prefetch a single image by creating a new Image object
 * This loads the image into browser cache without displaying it
 */
export function prefetchImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      resolve();
    };
    
    img.onerror = (error) => {
      console.warn(`Failed to prefetch image: ${src}`, error);
      resolve(); // Don't reject, just resolve to continue
    };
    
    // Set crossOrigin for Supabase images if needed
    if (src.includes('supabase') || src.includes('storage')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = src;
  });
}

/**
 * Prefetch multiple images in parallel
 * Returns a promise that resolves when all images are loaded or failed
 */
export async function prefetchImages(imageUrls: string[]): Promise<void> {
  if (!imageUrls || imageUrls.length === 0) {
    return;
  }

  // Filter out empty/null URLs
  const validUrls = imageUrls.filter(url => url && url.trim() !== '');
  
  if (validUrls.length === 0) {
    return;
  }

  try {
    // Prefetch all images in parallel
    await Promise.allSettled(
      validUrls.map(url => prefetchImage(url))
    );
  } catch (error) {
    console.warn('Some images failed to prefetch:', error);
  }
}

/**
 * Extract image URLs from project data for prefetching
 */
export function extractProjectImageUrls(projects: Array<{
  featured_image_url?: string;
  images?: Array<{
    image_url: string;
  }>;
}>): string[] {
  const imageUrls: string[] = [];
  
  projects.forEach(project => {
    // Add featured image
    if (project.featured_image_url) {
      imageUrls.push(project.featured_image_url);
    }
    
    // Add project images
    if (project.images && project.images.length > 0) {
      project.images.forEach(img => {
        if (img.image_url) {
          imageUrls.push(img.image_url);
        }
      });
    }
  });
  
  return imageUrls;
}

/**
 * Prefetch images with priority - featured images first, then others
 */
export async function prefetchProjectImages(projects: Array<{
  featured_image_url?: string;
  images?: Array<{
    image_url: string;
  }>;
}>): Promise<void> {
  const featuredImages: string[] = [];
  const otherImages: string[] = [];
  
  projects.forEach(project => {
    // Collect featured images first (higher priority)
    if (project.featured_image_url) {
      featuredImages.push(project.featured_image_url);
    }
    
    // Collect other images
    if (project.images && project.images.length > 0) {
      project.images.forEach(img => {
        if (img.image_url) {
          otherImages.push(img.image_url);
        }
      });
    }
  });
  
  // Prefetch featured images first
  if (featuredImages.length > 0) {
    await prefetchImages(featuredImages);
  }
  
  // Then prefetch other images
  if (otherImages.length > 0) {
    await prefetchImages(otherImages);
  }
}
