import Image from 'next/image';
import { PublicService } from '@/lib/services/public.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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

export async function ProjectsSection() {
  const projects = await PublicService.getFeaturedProjects('id'); // Indonesian by default

  return (
    <section className="relative py-16 md:py-24 lg:py-32">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Proyek Unggulan Kami
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Eksplorasi koleksi proyek-proyek inovatif yang telah kami kembangkan untuk berbagai klien di berbagai industri.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} isReversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, isReversed }: { readonly project: ProjectData; readonly isReversed: boolean }) {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 xl:gap-40 items-center`}>
        {/* Image Section */}
        <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
            {project.featured_image_url ? (
              <Image
                src={project.featured_image_url}
                alt={project.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-semibold">{project.name}</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge 
                variant={project.status === 'completed' ? 'default' : 'secondary'}
                className="bg-background/90 text-foreground"
              >
                {project.status === 'completed' ? 'Selesai' : 'Berlangsung'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
          {/* Project Header */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {project.name}
            </h3>
          </div>

          {/* Description */}
          <div className="prose prose-foreground max-w-none">
            <p className="text-muted-foreground leading-relaxed text-base">
              {project.short_description || project.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {project.project_url && (
              <Button size="lg" className="flex items-center gap-2" asChild>
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Lihat Proyek
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}