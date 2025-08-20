import { createClient } from "@/lib/supabase/server";

export class PublicService {
  /**
   * Get all published blog posts, ordered by newest first.
   */
  static async getPublishedBlogPosts() {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image_url,
          published_at,
          team_members(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .eq('is_active', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      throw new Error('Gagal mengambil data artikel blog.');
    }
  }

  /**
   * Get featured testimonials.
   */
  static async getFeaturedTestimonials() {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          id,
          client_name,
          client_position,
          client_company,
          client_avatar_url,
          testimonial_translations (
            content
          )
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map((testimonial) => ({
        id: testimonial.id,
        client_name: testimonial.client_name,
        client_position: testimonial.client_position,
        client_company: testimonial.client_company,
        client_avatar_url: testimonial.client_avatar_url,
        testimonial_text: testimonial.testimonial_translations?.[0]?.content || '',
      })) || [];
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      throw new Error('Failed to retrieve featured testimonials.');
    }
  }
}
