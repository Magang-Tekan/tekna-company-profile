import { createClient } from "@/lib/supabase/client";
import type { ProjectStatus, PostStatus } from "@/lib/types/dashboard";

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

  // ===============================
  // BLOG/POST CRUD OPERATIONS
  // ===============================

  /**
   * Create new blog post - Client side
   */
  static async createPost(postData: {
    title: string;
    slug: string;
    excerpt?: string;
    featured_image_url?: string;
    author_id?: string;
    category_id?: string;
    status: PostStatus;
    published_at?: string;
    is_featured?: boolean;
  }) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Gagal membuat artikel baru');
    }
  }

  /**
   * Update existing blog post - Client side
   */
  static async updatePost(
    postId: string, 
    postData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      featured_image_url?: string;
      author_id?: string;
      category_id?: string;
      status?: PostStatus;
      published_at?: string;
      is_featured?: boolean;
    }
  ) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Gagal mengupdate artikel');
    }
  }

  /**
   * Delete blog post (soft delete) - Client side
   */
  static async deletePost(postId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ is_active: false })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Gagal menghapus artikel');
    }
  }

  /**
   * Get single blog post by ID - Client side
   */
  static async getPostById(postId: string) {
    const supabase = createClient();
    
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
          view_count
        `)
        .eq('id', postId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Gagal mengambil data artikel');
    }
  }
}
