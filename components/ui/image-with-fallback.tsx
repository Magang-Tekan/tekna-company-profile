"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  readonly src: string | null;
  readonly alt: string;
  readonly fallbackSrc?: string;
  readonly fill?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
  readonly unoptimized?: boolean;
  readonly priority?: boolean;
  readonly size?: "small" | "medium" | "large";
  readonly sizes?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  fill = false,
  width,
  height,
  className,
  unoptimized = false,
  priority = false,
  size = "medium",
  sizes,
  ...props
}: ImageWithFallbackProps) {
  // Choose fallback based on size if not provided
  const defaultFallback =
    fallbackSrc ||
    (size === "large"
      ? "/images/placeholder-blog-large.svg"
      : "/images/placeholder-blog.svg");

  const [imageSrc, setImageSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(!src);
  const [imgError, setImgError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    if (src) {
      setImageSrc(src);
      setHasError(false);
      setImgError(false);
    } else {
      setImageSrc(defaultFallback);
      setHasError(true);
    }
  }, [src, defaultFallback]);

  // Use a hidden img tag to detect errors since Next.js Image doesn't support onError
  useEffect(() => {
    if (!src || hasError) return;

    const img = new window.Image();
    img.onload = () => {
      setImgError(false);
    };
    img.onerror = () => {
      setImgError(true);
      setImageSrc(defaultFallback);
      setHasError(true);
    };
    img.src = src;
  }, [src, defaultFallback, hasError]);

  const finalSrc = imgError || hasError ? defaultFallback : imageSrc;

  const imageProps = {
    ...props,
    src: finalSrc,
    alt,
    className: cn(className, (hasError || imgError) && "opacity-75"),
    unoptimized: (hasError || imgError) || unoptimized,
    priority,
    ...(sizes && { sizes }),
  };

  if (fill) {
    return <Image {...imageProps} fill alt={alt} />;
  }

  return <Image {...imageProps} width={width} height={height} alt={alt} />;
}
