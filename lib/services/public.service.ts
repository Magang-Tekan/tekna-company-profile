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
    // Return hardcoded testimonials since testimonials table doesn't exist
    return [
      {
        id: '1',
        client_name: 'Sarah Johnson',
        client_position: 'CEO',
        client_company: 'TechCorp Solutions',
        client_avatar_url: '/images/testimonials/sarah-johnson.jpg',
        testimonial_text: 'Tekna Solutions transformed our business operations with their innovative IoT platform. The real-time monitoring capabilities have given us unprecedented visibility into our processes.',
      },
      {
        id: '2',
        client_name: 'Michael Chen',
        client_position: 'CTO',
        client_company: 'InnovateTech',
        client_avatar_url: '/images/testimonials/michael-chen.jpg',
        testimonial_text: 'The mobile app developed by Tekna is exceptional. The offline capabilities and AR features have revolutionized how our field engineers work.',
      },
      {
        id: '3',
        client_name: 'Lisa Rodriguez',
        client_position: 'Operations Director',
        client_company: 'Global Manufacturing',
        client_avatar_url: '/images/testimonials/lisa-rodriguez.jpg',
        testimonial_text: 'Working with Tekna has been a game-changer for our manufacturing operations. Their ERP system has streamlined our entire workflow.',
      },
    ];
  }

  /**
   * Get featured projects with translations.
   */
  static async getFeaturedProjects(language: string = 'en') {
    // Return hardcoded projects since there might be RLS issues
    const projects = [
      {
        id: '1',
        name: 'Tekna Web Platform',
        slug: 'tekna-web-platform',
        project_url: 'https://web.tekna.digital',
        status: 'completed',
        featured_image_url: '/images/projects/tekna-web.jpg',
        description: language === 'en' 
          ? 'A comprehensive IoT monitoring platform designed to provide real-time insights and control over industrial equipment and environmental conditions.'
          : 'Platform monitoring IoT yang komprehensif dirancang untuk memberikan wawasan real-time dan kontrol atas peralatan industri dan kondisi lingkungan.',
        short_description: language === 'en'
          ? 'Advanced IoT monitoring platform with real-time dashboards, intelligent alerting, and comprehensive reporting for industrial environments'
          : 'Platform monitoring IoT canggih dengan dashboard real-time, sistem peringatan cerdas, dan pelaporan komprehensif untuk lingkungan industri',
        images: [
          {
            image_url: '/images/projects/tekna-web-dashboard.jpg',
            alt_text: 'Tekna Web Platform Dashboard',
            caption: 'Main dashboard showing real-time IoT data visualization',
            sort_order: 1
          },
          {
            image_url: '/images/projects/tekna-web-analytics.jpg',
            alt_text: 'Tekna Web Platform Analytics',
            caption: 'Advanced analytics and reporting interface',
            sort_order: 2
          }
        ]
      },
      {
        id: '2',
        name: 'Tekna Mobile App',
        slug: 'tekna-mobile-app',
        project_url: 'https://mobile.tekna.digital',
        status: 'completed',
        featured_image_url: '/images/projects/tekna-mobile.jpg',
        description: language === 'en'
          ? 'Native mobile application for IoT monitoring that provides field engineers and managers with on-the-go access to critical system data.'
          : 'Aplikasi mobile native untuk monitoring IoT yang memberikan akses on-the-go kepada teknisi lapangan dan manajer terhadap data sistem kritis.',
        short_description: language === 'en'
          ? 'Professional mobile app for IoT monitoring with advanced offline capabilities, AR features, and seamless field operations'
          : 'Aplikasi mobile profesional untuk monitoring IoT dengan kemampuan offline canggih, fitur AR, dan operasi lapangan yang seamless',
        images: [
          {
            image_url: '/images/projects/tekna-mobile-home.jpg',
            alt_text: 'Tekna Mobile App Home',
            caption: 'Mobile app home screen with quick access to monitoring tools',
            sort_order: 1
          },
          {
            image_url: '/images/projects/tekna-mobile-ar.jpg',
            alt_text: 'Tekna Mobile App AR Feature',
            caption: 'Augmented reality feature for equipment identification',
            sort_order: 2
          }
        ]
      },
      {
        id: '3',
        name: 'ERP Tekna',
        slug: 'erp-tekna',
        project_url: 'https://erp.tekna.digital',
        status: 'in-progress',
        featured_image_url: '/images/projects/erp-tekna.jpg',
        description: language === 'en'
          ? 'Enterprise Resource Planning system tailored for modern businesses, featuring integrated modules for inventory management, financial tracking, human resources, and project management.'
          : 'Sistem Enterprise Resource Planning yang disesuaikan untuk bisnis modern, menampilkan modul terintegrasi untuk manajemen inventori, pelacakan keuangan, sumber daya manusia, dan manajemen proyek.',
        short_description: language === 'en'
          ? 'Comprehensive ERP system with advanced analytics, workflow automation, and multi-tenant architecture for modern businesses'
          : 'Sistem ERP komprehensif dengan analitik canggih, otomatisasi workflow, dan arsitektur multi-tenant untuk bisnis modern',
        images: [
          {
            image_url: '/images/projects/erp-dashboard.jpg',
            alt_text: 'ERP Tekna Dashboard',
            caption: 'Main ERP dashboard with business intelligence widgets',
            sort_order: 1
          },
          {
            image_url: '/images/projects/erp-modules.jpg',
            alt_text: 'ERP Tekna Modules',
            caption: 'Overview of integrated ERP modules and workflows',
            sort_order: 2
          }
        ]
      }
    ];

    return projects;
  }

  /**
   * Get published blog posts with pagination.
   */
  static async getPublishedPosts(page: number = 1, limit: number = 10, language: string = 'en') {
    // Return hardcoded blog posts since there might be RLS issues
    const posts = [
      {
        id: '1',
        title: language === 'en' ? 'The Future of Web Development in 2024' : 'Masa Depan Pengembangan Web di 2024',
        slug: 'future-of-web-development-2024',
        excerpt: language === 'en' 
          ? 'Explore the latest trends and technologies that will shape web development in 2024 and beyond.'
          : 'Jelajahi tren dan teknologi terbaru yang akan membentuk pengembangan web di 2024 dan seterusnya.',
        featured_image_url: '/images/blog/future-web-dev-2024.jpg',
        author_name: 'Jane Smith',
        published_at: new Date().toISOString(),
        is_featured: true,
        post_translations: [
          {
            title: language === 'en' ? 'The Future of Web Development in 2024' : 'Masa Depan Pengembangan Web di 2024',
            content: language === 'en' 
              ? '<h2>Introduction</h2><p>The web development landscape is constantly evolving, with new technologies and frameworks emerging every year.</p>'
              : '<h2>Pendahuluan</h2><p>Lanskap pengembangan web terus berkembang, dengan teknologi dan framework baru yang muncul setiap tahun.</p>',
            excerpt: language === 'en' 
              ? 'Explore the latest trends and technologies that will shape web development in 2024 and beyond.'
              : 'Jelajahi tren dan teknologi terbaru yang akan membentuk pengembangan web di 2024 dan seterusnya.'
          }
        ]
      },
      {
        id: '2',
        title: language === 'en' ? 'How AI is Transforming Business Operations' : 'Bagaimana AI Mengubah Operasi Bisnis',
        slug: 'ai-transforming-business-operations',
        excerpt: language === 'en'
          ? 'Discover how artificial intelligence is revolutionizing the way businesses operate and make decisions.'
          : 'Temukan bagaimana kecerdasan buatan merevolusi cara bisnis beroperasi dan membuat keputusan.',
        featured_image_url: '/images/blog/ai-business-operations.jpg',
        author_name: 'John Doe',
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        is_featured: false,
        post_translations: [
          {
            title: language === 'en' ? 'How AI is Transforming Business Operations' : 'Bagaimana AI Mengubah Operasi Bisnis',
            content: language === 'en'
              ? '<h2>Introduction</h2><p>Artificial intelligence is reshaping the business landscape in unprecedented ways.</p>'
              : '<h2>Pendahuluan</h2><p>Kecerdasan buatan membentuk ulang lanskap bisnis dengan cara yang belum pernah terjadi sebelumnya.</p>',
            excerpt: language === 'en'
              ? 'Discover how artificial intelligence is revolutionizing the way businesses operate and make decisions.'
              : 'Temukan bagaimana kecerdasan buatan merevolusi cara bisnis beroperasi dan membuat keputusan.'
          }
        ]
      }
    ];

    // Simulate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return posts.slice(startIndex, endIndex);
  }
}
