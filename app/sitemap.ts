import { MetadataRoute } from 'next'
import { PublicService } from '@/lib/services/public.service'
import { CareerService } from '@/lib/services/career'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tekna.id'
  const currentDate = new Date()
  
  /**
   * PRIORITY STRUCTURE FOR GOOGLE SITELINKS:
   * 1.0 - Homepage (most important)
   * 0.9 - Main category pages (About, Services main page)
   * 0.8 - Important child pages (Projects, Products, Blog, Career, Service subcategories)
   * 0.7 - Secondary pages (Contact, Team, Individual projects/posts)
   * 0.6 - Tertiary pages (Partners, FAQ, Categories)
   * 0.3 - Legal/Static pages (Privacy, Terms)
   * 
   * CHANGE FREQUENCY GUIDELINES:
   * - daily: Blog main page (new content)
   * - weekly: Homepage, Projects, Products, Career (regular updates)
   * - monthly: About, Services, Contact, Team (occasional updates)
   * - yearly: Legal pages (rare updates)
   */
  
  // TIER 1: Homepage - Highest Priority (1.0)
  const homePage = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]

  // TIER 2: Main Category Pages - Very High Priority (0.9)
  const mainCategoryPages = [
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ]

  // TIER 3: Important Child Pages - High Priority (0.8)
  // These are the pages Google should prioritize for sitelinks
  const importantPages = [
    // Projects & Portfolio
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Products
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Blog - Content Hub
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    // Career - Talent Acquisition
    {
      url: `${baseUrl}/career`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // TIER 4: Secondary Pages - Medium-High Priority (0.7)
  const secondaryPages = [
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // TIER 5: Tertiary Pages - Medium Priority (0.6)
  const tertiaryPages = [
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // TIER 6: Legal Pages - Low Priority (0.3)
  const legalPages = [
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

  /**
   * SITEMAP ORDER STRATEGY FOR GOOGLE SITELINKS:
   * Pages are ordered by priority (highest first) to help Google understand
   * the site structure and identify the most important pages for sitelinks.
   * 
   * This order signals to Google which pages should appear as sitelinks:
   * 1. Homepage
   * 2. Main category pages (About)
   * 3. Important child pages (Projects, Products, Blog, Career)
   * 4. Dynamic content (Blog categories, individual posts, projects, careers)
   * 5. Secondary/Tertiary pages
   * 6. Legal pages
   */
  return [
    ...homePage,
    ...mainCategoryPages,
    ...importantPages,
    ...blogCategoryPages,
    ...blogPosts,
    ...projects,
    ...careerPositions,
    ...secondaryPages,
    ...tertiaryPages,
    ...legalPages,
  ]
}
