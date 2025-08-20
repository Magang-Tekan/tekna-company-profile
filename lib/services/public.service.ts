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

  /**
   * Get featured projects with translations.
   */
  static async getFeaturedProjects(language: string = 'en') {
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
          project_translations!inner (
            description,
            short_description,
            challenges,
            solutions,
            technologies,
            results,
            languages!inner (
              code
            )
          ),
          project_images (
            image_url,
            alt_text,
            caption,
            sort_order
          )
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .eq('project_translations.languages.code', language)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      return data?.map((project) => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        client_name: project.client_name,
        project_url: project.project_url,
        github_url: project.github_url,
        start_date: project.start_date,
        end_date: project.end_date,
        status: project.status,
        featured_image_url: project.featured_image_url,
        description: project.project_translations?.[0]?.description || '',
        short_description: project.project_translations?.[0]?.short_description || '',
        challenges: project.project_translations?.[0]?.challenges || '',
        solutions: project.project_translations?.[0]?.solutions || '',
        technologies: project.project_translations?.[0]?.technologies || '',
        results: project.project_translations?.[0]?.results || '',
        images: project.project_images?.sort((a, b) => a.sort_order - b.sort_order) || [],
      })) || [];
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      throw new Error('Failed to retrieve featured projects.');
    }
  }
}
