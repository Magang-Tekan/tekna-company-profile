import Image from 'next/image';
import { PublicService } from '@/lib/services/public.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  client_name: string;
  project_url?: string;
  github_url?: string;
  start_date: string;
  end_date?: string;
  status: string;
  featured_image_url?: string;
  description: string;
  short_description: string;
  challenges: string;
  solutions: string;
  technologies: string;
  results: string;
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
    <section className="relative">
      {/* Header */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Proyek Unggulan Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Eksplorasi koleksi proyek-proyek inovatif yang telah kami kembangkan untuk berbagai klien di berbagai industri.
          </p>
        </div>
      </div>

      {/* Projects List - Each project gets full viewport */}
      {projects.map((project, index) => (
        <ProjectRow key={project.id} project={project} isReversed={index % 2 === 1} />
      ))}
    </section>
  );
}

function ProjectRow({ project, isReversed }: { readonly project: ProjectData; readonly isReversed: boolean }) {
  const parseArrayField = (field: string): string[] => {
    try {
      if (Array.isArray(field)) return field;
      return JSON.parse(field || '[]');
    } catch {
      // If parsing fails, assume it's a comma-separated string
      if (typeof field === 'string') {
        return field.split(',').map(item => item.trim());
      }
      return [];
    }
  };

  const technologies = parseArrayField(project.technologies);
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 xl:gap-40 items-center`}>
          {/* Image Section */}
          <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl group">
              {project.featured_image_url ? (
                <Image
                  src={project.featured_image_url}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">{project.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <Badge 
                  variant={project.status === 'completed' ? 'default' : 'secondary'}
                  className="bg-white/90 text-gray-900 hover:bg-white"
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
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.start_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                  {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}`}
                </div>
                {project.client_name && (
                  <>
                    <span className="hidden sm:block">•</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      Klien: {project.client_name}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                {project.short_description || project.description}
              </p>
            </div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Teknologi yang Digunakan:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.slice(0, 6).map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-sm py-1 px-3">
                      {tech}
                    </Badge>
                  ))}
                  {technologies.length > 6 && (
                    <Badge variant="outline" className="text-sm py-1 px-3">
                      +{technologies.length - 6} lainnya
                    </Badge>
                  )}
                </div>
              </div>
            )}

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
              {project.github_url && (
                <Button size="lg" variant="outline" className="flex items-center gap-2" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}