import { createClient } from "@/lib/supabase/server";
import type { DashboardData, ProjectStatus } from "@/lib/types/dashboard";

export class DashboardService {
  /**
   * Get dashboard statistics and data
   */
  static async getDashboardData(): Promise<DashboardData> {
    const supabase = await createClient();
    
    try {
      // Get all data in parallel for better performance
      const [
        teamCountResult,
        projectsCountResult,
        postsCountResult,
        testimonialsCountResult,
        servicesCountResult,
        recentProjectsResult,
        recentPostsResult
      ] = await Promise.all([
        // Team members count
        supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Active projects count
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Published posts count
        supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .eq('is_active', true),
        
        // Testimonials count
        supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Services count
        supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Recent projects
        supabase
          .from('projects')
          .select(`
            id,
            name,
            client_name,
            status,
            start_date,
            end_date,
            project_translations!inner(
              short_description
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3),
        
        // Recent posts
        supabase
          .from('posts')
          .select(`
            id,
            title,
            status,
            view_count,
            published_at,
            team_members(
              first_name,
              last_name
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // Extract data from results
      const teamCount = teamCountResult.count || 0;
      const projectsCount = projectsCountResult.count || 0;
      const postsCount = postsCountResult.count || 0;
      const testimonialsCount = testimonialsCountResult.count || 0;
      const servicesCount = servicesCountResult.count || 0;
      const recentProjects = recentProjectsResult.data || [];
      const recentPosts = recentPostsResult.data || [];

      return {
        stats: [
          {
            title: "Total Tim",
            value: teamCount.toString(),
            description: "Anggota tim aktif",
            change: "+2",
            changeType: "positive" as const
          },
          {
            title: "Proyek Aktif",
            value: projectsCount.toString(),
            description: "Proyek sedang berjalan",
            change: "+1",
            changeType: "positive" as const
          },
          {
            title: "Artikel Blog",
            value: postsCount.toString(),
            description: "Artikel diterbitkan",
            change: "+3",
            changeType: "positive" as const
          },
          {
            title: "Testimonial",
            value: testimonialsCount.toString(),
            description: "Ulasan klien",
            change: "+2",
            changeType: "positive" as const
          }
        ],
        recentProjects: recentProjects.map(project => ({
          id: project.id,
          name: project.name,
          client: project.client_name || 'N/A',
          status: project.status as ProjectStatus,
          startDate: project.start_date,
          endDate: project.end_date,
          description: project.project_translations?.[0]?.short_description || ''
        })),
        recentPosts: recentPosts.map(post => ({
          id: post.id,
          title: post.title,
          author: post.team_members && post.team_members.length > 0 
            ? `${post.team_members[0].first_name} ${post.team_members[0].last_name}` 
            : 'Admin',
          status: post.status as 'draft' | 'published' | 'archived',
          views: post.view_count || 0,
          publishedAt: post.published_at
        })),
        servicesCount
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Gagal mengambil data dashboard');
    }
  }

  /**
   * Get team members data
   */
  static async getTeamMembers() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          first_name,
          last_name,
          email,
          position,
          department,
          avatar_url,
          is_active
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Gagal mengambil data tim');
    }
  }

  /**
   * Get projects data
   */
  static async getProjects() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          client_name,
          status,
          start_date,
          end_date,
          is_featured,
          is_active
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Gagal mengambil data proyek');
    }
  }

  /**
   * Get single project by ID
   */
  static async getProjectById(projectId: string) {
    const supabase = await createClient();
    
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

  /**
   * Create new project
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
    const supabase = await createClient();
    
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
   * Update existing project
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
    const supabase = await createClient();
    
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
   * Delete project (soft delete)
   */
  static async deleteProject(projectId: string) {
    const supabase = await createClient();
    
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
   * Get all blog posts - Server side
   */
  static async getBlogPosts() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          author_id,
          category_id,
          status,
          published_at,
          is_featured,
          is_active,
          view_count,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  /**
   * Get services data
   */
  static async getServices() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          name,
          slug,
          icon,
          image_url,
          is_active
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Gagal mengambil data layanan');
    }
  }

  /**
   * Get testimonials data
   */
  static async getTestimonials() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          id,
          client_name,
          client_position,
          client_company,
          rating,
          is_active,
          is_featured
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw new Error('Gagal mengambil data testimonial');
    }
  }
}
