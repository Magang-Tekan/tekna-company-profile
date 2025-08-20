"use client"

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import type { ProjectStatus } from "@/lib/types/dashboard";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [project, setProject] = useState<{
    id: string;
    name: string;
    slug: string;
    client_name: string | null;
    project_url: string | null;
    github_url: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string;
    featured_image_url: string | null;
    is_featured: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getProject() {
      try {
        const projectData = await ClientDashboardService.getProjectById(params.id);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !project) {
    notFound();
  }

  return (
    <ProjectForm 
      mode="edit" 
      projectId={project.id}
      initialData={{
        name: project.name,
        slug: project.slug,
        client_name: project.client_name || '',
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status as ProjectStatus,
        featured_image_url: project.featured_image_url || '',
        is_featured: project.is_featured || false,
      }}
    />
  );
}
