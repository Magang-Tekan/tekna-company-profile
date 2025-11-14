/**
 * Breadcrumb Structured Data Component
 * 
 * This component generates JSON-LD breadcrumb markup for SEO.
 * Breadcrumbs help Google understand your site's hierarchical structure
 * and can improve the display of sitelinks in search results.
 * 
 * Usage:
 * <BreadcrumbStructuredData
 *   items={[
 *     { name: "Home", url: "https://tekna.id" },
 *     { name: "Blog", url: "https://tekna.id/blog" },
 *     { name: "Article Title", url: "https://tekna.id/blog/article" }
 *   ]}
 * />
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}
