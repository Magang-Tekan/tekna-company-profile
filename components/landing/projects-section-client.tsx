'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  status: string;
  featured_image_url?: string;
  description: string;
  short_description: string;
  images: {
    image_url: string;
    alt_text?: string;
    caption?: string;
    sort_order: number;
  }[];
}

export function ProjectsSectionClient({ projects }: { projects: ProjectData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    const container = containerRef.current;
    const projectElements = projectsRef.current;

    // Set initial state - semua projects dimulai dari depan (scale besar, z-index tinggi)
    gsap.set(projectElements, {
      scale: 2,
      zIndex: (index) => projects.length - index, // Project pertama paling depan
      rotationX: -15,
      y: 0,
      opacity: 1,
      transformOrigin: "center center",
      transformStyle: "preserve-3d"
    });

    // Animasi scroll-triggered untuk setiap project
    projectElements.forEach((project, index) => {
      if (!project) return;

      ScrollTrigger.create({
        trigger: container,
        start: `top+=${index * 100} center`,
        end: `bottom-=${(projects.length - index - 1) * 100} center`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calculate stacking effect
          const scale = 2 - (progress * 1.3); // Mengecil dari 2 ke 0.7
          const z = progress * -200; // Mundur ke belakang
          const rotX = -15 + (progress * 15); // Rotasi dari -15 ke 0
          const y = progress * 50; // Sedikit turun
          const opacity = 1 - (progress * 0.3); // Fade sedikit
          
          gsap.set(project, {
            scale: Math.max(scale, 0.7), // Minimal scale 0.7
            z: z,
            rotationX: rotX,
            y: y,
            opacity: Math.max(opacity, 0.7), // Minimal opacity 0.7
            zIndex: projects.length - index - Math.floor(progress * 10),
          });
        }
      });

      // Animasi masuk untuk project (saat pertama kali terlihat)
      ScrollTrigger.create({
        trigger: project,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.fromTo(project.querySelector('.project-content'), {
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0
          }, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [projects]);

  const addProjectRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      projectsRef.current[index] = el;
    }
  };

  return (
    <section id="projects-section" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background decoration untuk enhance depth */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
        initial={{ opacity: 0, scale: 3 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 3 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ 
          perspective: "1000px", // 3D perspective untuk container
          transformStyle: "preserve-3d" 
        }}
      >
        {/* Enhanced Header */}
        <motion.div 
          variants={headerVariants}
          className="mb-16"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Proyek Unggulan Kami
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Eksplorasi koleksi proyek-proyek inovatif yang telah kami kembangkan untuk berbagai klien di berbagai industri.
            </motion.p>
          </div>
        </motion.div>

        {/* Projects List dengan enhanced spacing */}
        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              custom={index}
              // Additional individual animation
              initial={{ opacity: 0, scale: 0.7, y: 60, rotateY: -15, filter: "blur(8px)" }}
              whileInView={{ 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                rotateY: 0, 
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  delay: index * 0.1, // Stagger delay berdasarkan index
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <ProjectRow project={project} isReversed={index % 2 === 1} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProjectRow({ project, isReversed }: { readonly project: ProjectData; readonly isReversed: boolean }) {
  // Enhanced image animation dengan parallax-like effect
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 1.2,
      rotateY: isReversed ? -20 : 20,
      rotateX: 5,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Enhanced content animation
  const contentVariants = {
    hidden: {
      opacity: 0,
      x: isReversed ? 60 : -60,
      y: 30,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 xl:gap-40 items-center`}>
        {/* Enhanced Image Section */}
        <motion.div 
          className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ 
            scale: 1.02, 
            rotateY: isReversed ? 2 : -2,
            transition: { duration: 0.3 }
          }}
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
            {project.featured_image_url ? (
              <motion.div
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  src={project.featured_image_url}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <motion.span 
                  className="text-primary-foreground text-xl font-semibold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {project.name}
                </motion.span>
              </div>
            )}
            
            {/* Enhanced Status Badge */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.6, rotateZ: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, rotateZ: 5 }}
            >
              <Badge 
                variant={project.status === 'completed' ? 'default' : 'secondary'}
                className="bg-background/90 text-foreground shadow-lg backdrop-blur-sm"
              >
                {project.status === 'completed' ? 'Selesai' : 'Berlangsung'}
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Content Section */}
        <motion.div 
          className={`space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
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
              {project.short_description || project.description}
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
            {project.project_url && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Button size="lg" className="flex items-center gap-2 shadow-lg" asChild>
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Lihat Proyek
                  </a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}