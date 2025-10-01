import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tekna.id'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/services',
          '/portfolio', 
          '/projects',
          '/career',
          '/blog',
          '/contact',
          '/partners',
          '/sitemap.xml',
          '/robots.txt'
        ],
        disallow: [
          '/dashboard/',
          '/admin/', 
          '/api/',
          '/auth/',
          '/_next/',
          '/*.json$',
          '/*.xml$'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}