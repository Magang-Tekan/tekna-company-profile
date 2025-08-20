import { createClient } from "@/lib/supabase/client";
import type { ProjectStatus } from "@/lib/types/dashboard";

export class ClientDashboardService {
  /**
   * Delete project (soft delete) - Client side
   */
  static async deleteProject(projectId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ is_active: false })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Gagal menghapus proyek');
    }
  }

  /**
   * Create new project - Client side
   */
  static async createProject(projectData: {
    name: string;
    slug: string;
    client_name?: string;
    project_url?: string;
    github_url?: string;
    start_date?: string;
    end_date?: string;
    status: ProjectStatus;
    featured_image_url?: string;
    is_featured?: boolean;
  }) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Gagal membuat proyek baru');
    }
  }

  /**
   * Update existing project - Client side
   */
  static async updateProject(
    projectId: string, 
    projectData: {
      name?: string;
      slug?: string;
      client_name?: string;
      project_url?: string;
      github_url?: string;
      start_date?: string;
      end_date?: string;
      status?: ProjectStatus;
      featured_image_url?: string;
      is_featured?: boolean;
    }
  ) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Gagal mengupdate proyek');
    }
  }

  /**
   * Get single project by ID - Client side
   */
  static async getProjectById(projectId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          slug,
          client_name,
          project_url,
          github_url,
          start_date,
          end_date,
          status,
          featured_image_url,
          is_featured,
          is_active
        `)
        .eq('id', projectId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Gagal mengambil data proyek');
    }
  }
}
