import { PublicService } from "@/lib/services/public.service";
import { ProjectsSectionClient } from "./projects-section-client";
import { prefetchProjectImages } from "@/lib/utils/image-prefetch";

export async function ProjectsSection() {
  const projects = await PublicService.getFeaturedProjects("id"); // Indonesian by default

  // Prefetch images on server side for better performance
  if (projects && projects.length > 0) {
    try {
      await prefetchProjectImages(projects);
    } catch (error) {
      console.warn("Server-side image prefetch failed:", error);
      // Continue execution even if prefetch fails
    }
  }

  return <ProjectsSectionClient projects={projects} />;
}
