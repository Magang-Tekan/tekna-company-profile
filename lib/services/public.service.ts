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

  
}
