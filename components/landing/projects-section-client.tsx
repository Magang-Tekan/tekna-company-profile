"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { prefetchProjectImages } from "@/lib/utils/image-prefetch";

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  images: {
    image_url: string;
    alt_text?: string;
    caption?: string;
    sort_order: number;
  }[];
}

export function ProjectsSectionClient({
  projects,
}: Readonly<{
  projects: ProjectData[];
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { once: true, margin: "-100px" });

  const [imagesPrefetched, setImagesPrefetched] = useState(false);

  // Delay image prefetching to prioritize FCP
  useEffect(() => {
    if (projects && projects.length > 0 && !imagesPrefetched) {
      // Delay prefetching to not block initial render
      const timer = setTimeout(() => {
        prefetchProjectImages(projects)
          .then(() => {
            setImagesPrefetched(true);
          })
          .catch((error) => {
            console.warn("Failed to prefetch project images:", error);
            setImagesPrefetched(true); // Still set to true to avoid retries
          });
      }, 500); // Delay prefetching by 500ms

      return () => clearTimeout(timer);
    }
  }, [projects, imagesPrefetched]);

  // Simplified animation variants for better performance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        zIndex: 50, // Higher than hero section to ensure buttons are clickable
        marginTop: "-200vh", // Strong overlap with hero section
        paddingTop: "250vh", // Space for the overlapping effect
        background: "transparent", // Buat background transparan agar globe terlihat
      }}
    >
      {/* Enhanced background with depth effect - lebih transparan */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80" />

      {/* Smooth transition gradient to solid background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/95 to-transparent" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* Projects List - 1 viewport per project */}
        <div className="space-y-0">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              custom={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="min-h-screen flex items-center justify-center py-20"
            >
              <ProjectRow project={project} isReversed={index % 2 === 1} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProjectRow({
  project,
  isReversed,
}: {
  readonly project: ProjectData;
  readonly isReversed: boolean;
}) {
  // Simplified animations for better performance
  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: isReversed ? 20 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 xl:gap-40 items-center`}
      >
        {/* Enhanced Image Section */}
        <motion.div
          className={`${isReversed ? "lg:order-2" : "lg:order-1"}`}
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{
            scale: 1.01,
            transition: { duration: 0.2 },
          }}
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={project.featured_image_url ?? null}
                alt={project.name}
                fill
                size="large"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
                className="object-cover transition-opacity duration-300"
              />
            </motion.div>
            {!project.featured_image_url && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <motion.span
                  className="text-primary-foreground text-xl font-semibold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {project.name}
                </motion.span>
              </div>
            )}

            {/* Enhanced Status Badge */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Enhanced Content Section */}
        <motion.div
          className={`space-y-6 ${isReversed ? "lg:order-1" : "lg:order-2"}`}
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced Project Header */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {project.name}
            </h3>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div
            className="prose prose-foreground max-w-none"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-muted-foreground leading-relaxed text-base">
              {project.description}
            </p>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 pt-2"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md has-[>svg]:px-4 text-lg px-8 py-6 pointer-events-auto"
                asChild
              >
                <Link href={`/projects/${project.slug}`}>
                  <Eye className="w-4 h-4" />
                  Detail Proyek
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
