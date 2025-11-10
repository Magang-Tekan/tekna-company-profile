import { MetadataRoute } from 'next'
import { PublicService } from '@/lib/services/public.service'
import { CareerService } from '@/lib/services/career'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tekna.id'
  const currentDate = new Date()
  
  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    // Service pages - high priority for business
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/iot-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/mobile-app-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/web-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Portfolio and Projects - showcase work
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Blog - fresh content
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    // Career - attract talent
    {
      url: `${baseUrl}/career`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Contact and business pages
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Additional service landing pages for SEO
  const servicePages = [
    {
      url: `${baseUrl}/services/software-house-jakarta`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/jasa-pembuatan-aplikasi`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/developer-aplikasi-indonesia`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/transformasi-digital`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Fetch dynamic content
  let blogPosts: MetadataRoute.Sitemap = []
  let projects: MetadataRoute.Sitemap = []
  let careerPositions: MetadataRoute.Sitemap = []
  let blogCategoryPages: MetadataRoute.Sitemap = []

  try {
    // Fetch all published blog posts
    const posts = await PublicService.getPublishedBlogPosts()
    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Fetch all active categories for blog category pages
    const categories = await PublicService.getActiveCategories()
    blogCategoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Fetch all active projects
    const projectsResult = await PublicService.getAllProjects({ limit: 1000 })
    projects = projectsResult.data.map((project: { slug: string; updated_at: string }) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Fetch all published career positions
    const careerService = new CareerService()
    const positions = await careerService.getPublicPositions({ 
      page: 1, 
      limit: 1000
    })
    careerPositions = positions.positions.map((position) => ({
      url: `${baseUrl}/career/${position.slug}`,
      lastModified: position.created_at ? new Date(position.created_at) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    // Continue with static pages even if dynamic content fails
  }

  return [
    ...staticPages,
    ...servicePages,
    ...blogCategoryPages,
    ...blogPosts,
    ...projects,
    ...careerPositions,
  ]
}
