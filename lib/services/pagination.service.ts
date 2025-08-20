import { createClient } from "@/lib/supabase/client";

export interface PaginationParams {
  page_number: number;
  page_size: number;
  search_query?: string;
  category_id?: string;
  status_filter?: string;
  language_code?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export class PaginationService {
  /**
   * Get paginated posts with search and filtering
   */
  static async getPaginatedPosts(params: PaginationParams): Promise<PaginatedResult<any>> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.rpc('get_paginated_posts', {
        search_query: params.search_query || '',
        category_id: params.category_id || null,
        status_filter: params.status_filter || 'published',
        page_number: params.page_number,
        page_size: params.page_size,
        language_code: params.language_code || 'en'
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          data: [],
          total_count: 0,
          page_number: params.page_number,
          page_size: params.page_size,
          total_pages: 0,
          has_next: false,
          has_previous: false
        };
      }

      const total_count = data[0]?.total_count || 0;
      const total_pages = Math.ceil(total_count / params.page_size);

      return {
        data: data.map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          featured_image_url: item.featured_image_url,
          author_name: item.author_name,
          status: item.status,
          published_at: item.published_at,
          is_featured: item.is_featured
        })),
        total_count,
        page_number: params.page_number,
        page_size: params.page_size,
        total_pages,
        has_next: params.page_number < total_pages,
        has_previous: params.page_number > 1
      };
    } catch (error) {
      console.error('Error getting paginated posts:', error);
      throw error;
    }
  }

  /**
   * Get paginated projects with search and filtering
   */
  static async getPaginatedProjects(params: PaginationParams): Promise<PaginatedResult<any>> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.rpc('get_paginated_projects', {
        search_query: params.search_query || '',
        status_filter: params.status_filter || 'all',
        page_number: params.page_number,
        page_size: params.page_size,
        language_code: params.language_code || 'en'
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          data: [],
          total_count: 0,
          page_number: params.page_number,
          page_size: params.page_size,
          total_pages: 0,
          has_next: false,
          has_previous: false
        };
      }

      const total_count = data[0]?.total_count || 0;
      const total_pages = Math.ceil(total_count / params.page_size);

      return {
        data: data.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          project_url: item.project_url,
          status: item.status,
          featured_image_url: item.featured_image_url,
          description: item.description,
          short_description: item.short_description
        })),
        total_count,
        page_number: params.page_number,
        page_size: params.page_size,
        total_pages,
        has_next: params.page_number < total_pages,
        has_previous: params.page_number > 1
      };
    } catch (error) {
      console.error('Error getting paginated projects:', error);
      throw error;
    }
  }

  /**
   * Get paginated newsletter subscriptions (super admin only)
   */
  static async getPaginatedNewsletterSubscriptions(
    page_number: number = 1,
    page_size: number = 20,
    search_query?: string
  ): Promise<PaginatedResult<any>> {
    const supabase = createClient();
    
    try {
      let query = supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (search_query) {
        query = query.or(`email.ilike.%${search_query}%,first_name.ilike.%${search_query}%,last_name.ilike.%${search_query}%`);
      }

      const { data, error, count } = await query
        .order('subscribed_at', { ascending: false })
        .range((page_number - 1) * page_size, page_number * page_size - 1);

      if (error) throw error;

      const total_count = count || 0;
      const total_pages = Math.ceil(total_count / page_size);

      return {
        data: data || [],
        total_count,
        page_number,
        page_size,
        total_pages,
        has_next: page_number < total_pages,
        has_previous: page_number > 1
      };
    } catch (error) {
      console.error('Error getting paginated newsletter subscriptions:', error);
      throw error;
    }
  }

  /**
   * Get paginated categories
   */
  static async getPaginatedCategories(
    page_number: number = 1,
    page_size: number = 50,
    search_query?: string
  ): Promise<PaginatedResult<any>> {
    const supabase = createClient();
    
    try {
      let query = supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Apply search filter
      if (search_query) {
        query = query.or(`name.ilike.%${search_query}%,description.ilike.%${search_query}%`);
      }

      const { data, error, count } = await query
        .order('sort_order', { ascending: true })
        .range((page_number - 1) * page_size, page_number * page_size - 1);

      if (error) throw error;

      const total_count = count || 0;
      const total_pages = Math.ceil(total_count / page_size);

      return {
        data: data || [],
        total_count,
        page_number,
        page_size,
        total_pages,
        has_next: page_number < total_pages,
        has_previous: page_number > 1
      };
    } catch (error) {
      console.error('Error getting paginated categories:', error);
      throw error;
    }
  }

  /**
   * Get paginated tags
   */
  static async getPaginatedTags(
    page_number: number = 1,
    page_size: number = 100,
    search_query?: string
  ): Promise<PaginatedResult<any>> {
    const supabase = createClient();
    
    try {
      let query = supabase
        .from('tags')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (search_query) {
        query = query.or(`name.ilike.%${search_query}%`);
      }

      const { data, error, count } = await query
        .order('name', { ascending: true })
        .range((page_number - 1) * page_size, page_number * page_size - 1);

      if (error) throw error;

      const total_count = count || 0;
      const total_pages = Math.ceil(total_count / page_size);

      return {
        data: data || [],
        total_count,
        page_number,
        page_size,
        total_pages,
        has_next: page_number < total_pages,
        has_previous: page_number > 1
      };
    } catch (error) {
      console.error('Error getting paginated tags:', error);
      throw error;
    }
  }

  /**
   * Calculate pagination info
   */
  static calculatePaginationInfo(
    total_count: number,
    page_number: number,
    page_size: number
  ) {
    const total_pages = Math.ceil(total_count / page_size);
    const has_next = page_number < total_pages;
    const has_previous = page_number > 1;

    // Calculate page range for pagination display
    const start_page = Math.max(1, page_number - 2);
    const end_page = Math.min(total_pages, page_number + 2);

    return {
      total_count,
      page_number,
      page_size,
      total_pages,
      has_next,
      has_previous,
      start_page,
      end_page,
      page_range: Array.from(
        { length: end_page - start_page + 1 },
        (_, i) => start_page + i
      )
    };
  }
}
