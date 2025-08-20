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
          client_avatar_url,
          testimonial_translations (
            content
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.client_name,
        title: testimonial.client_position,
        quote: testimonial.testimonial_translations[0]?.content || '',
        avatar_url: testimonial.client_avatar_url,
      })) || [];
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      throw new Error('Failed to retrieve featured testimonials.');
    }
  }
}
