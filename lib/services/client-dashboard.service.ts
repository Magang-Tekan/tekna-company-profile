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
    project_url?: string;
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
      project_url?: string;
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
   * Get default language ID
   */
  static async getDefaultLanguageId(): Promise<string> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('id')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error getting default language:', error);
      // Fallback to first available language
      const { data } = await supabase
        .from('languages')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single();
      
      return data?.id || 'en'; // Ultimate fallback
    }
  }

  /**
   * Create new blog post - Client side
   */
  static async createPost(postData: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image_url?: string;
    author_id?: string;
    category_id?: string;
    status: PostStatus;
    published_at?: string;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  }) {
    const supabase = createClient();
    
    try {
      // Get default language ID
      const defaultLanguageId = await this.getDefaultLanguageId();

      // First, create the main post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          featured_image_url: postData.featured_image_url,
          author_id: postData.author_id || null,
          category_id: postData.category_id || null,
          status: postData.status,
          published_at: postData.published_at,
          is_featured: postData.is_featured || false,
          is_active: true
        })
        .select()
        .single();

      if (postError) throw postError;

      // Then, create the post translation for default language
      if (post && postData.content) {
        const { error: translationError } = await supabase
          .from('post_translations')
          .insert({
            post_id: post.id,
            language_id: defaultLanguageId,
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt,
            meta_title: postData.meta_title || postData.title,
            meta_description: postData.meta_description || postData.excerpt,
            meta_keywords: postData.meta_keywords
          });

        if (translationError) {
          console.error('Error creating post translation:', translationError);
          // Continue anyway as the main post was created
        }
      }

      return post;
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
      content?: string;
      featured_image_url?: string;
      author_id?: string;
      category_id?: string;
      status?: PostStatus;
      published_at?: string;
      is_featured?: boolean;
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string;
    }
  ) {
    const supabase = createClient();
    
    try {
      // Get default language ID
      const defaultLanguageId = await this.getDefaultLanguageId();

      // Update the main post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          featured_image_url: postData.featured_image_url,
          author_id: postData.author_id || null,
          category_id: postData.category_id || null,
          status: postData.status,
          published_at: postData.published_at,
          is_featured: postData.is_featured
        })
        .eq('id', postId)
        .eq('is_active', true)
        .select()
        .single();

      if (postError) throw postError;

      // Update the post translation for default language
      if (postData.content || postData.meta_title || postData.meta_description || postData.meta_keywords) {
        const { error: translationError } = await supabase
          .from('post_translations')
          .upsert({
            post_id: postId,
            language_id: defaultLanguageId,
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt,
            meta_title: postData.meta_title,
            meta_description: postData.meta_description,
            meta_keywords: postData.meta_keywords
          }, {
            onConflict: 'post_id,language_id'
          });

        if (translationError) {
          console.error('Error updating post translation:', translationError);
          // Continue anyway as the main post was updated
        }
      }

      return post;
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
      // Get main post data
      const { data: post, error: postError } = await supabase
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
        .eq('id', postId)
        .eq('is_active', true)
        .single();

      if (postError) throw postError;

      // Get post translation content for default language
      if (post) {
        const defaultLanguageId = await this.getDefaultLanguageId();
        const { data: translation, error: translationError } = await supabase
          .from('post_translations')
          .select(`
            content,
            meta_title,
            meta_description,
            meta_keywords
          `)
          .eq('post_id', postId)
          .eq('language_id', defaultLanguageId)
          .single();

        if (!translationError && translation) {
          return {
            ...post,
            content: translation.content || '',
            meta_title: translation.meta_title || post.title,
            meta_description: translation.meta_description || post.excerpt,
            meta_keywords: translation.meta_keywords || ''
          };
        }
      }

      return post;
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw new Error('Gagal mengambil artikel');
    }
  }

  /**
   * Get all categories - Client side
   */
  static async getCategories() {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          color,
          is_active
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get all authors (team members) - Client side
   */
  static async getAuthors() {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          first_name,
          last_name,
          position,
          department,
          avatar_url,
          is_active
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching authors:', error);
      return [];
    }
  }
}
