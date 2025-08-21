import { PublicService } from '@/lib/services/public.service';
import { PublicLayout } from '@/components/layout/public-layout';
import { BlogGrid } from '@/components/blog/blog-grid';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

async function getCategoryData(categorySlug: string, params: {
  page?: number;
  search?: string;
}) {
  try {
    const [categories, postsResult] = await Promise.all([
      PublicService.getActiveCategories(),
      PublicService.getPaginatedPublishedPosts({
        ...params,
        category: categorySlug,
      }),
    ]);

    const category = categories.find(c => c.slug === categorySlug);
    
    return {
      category,
      posts: postsResult.data,
      pagination: postsResult.pagination,
      allCategories: categories,
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      category: null,
      posts: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      allCategories: [],
    };
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const { category } = await getCategoryData(resolvedParams.slug, {});
  
  if (!category) {
    return {
      title: 'Category Not Found | Tekna Solutions',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} Articles | Tekna Solutions Blog`,
    description: category.description || `Explore articles in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} Articles`,
      description: category.description || `Explore articles in the ${category.name} category.`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';

  const { category, posts, pagination, allCategories } = await getCategoryData(resolvedParams.slug, {
    page,
    search,
  });

  if (!category) {
    notFound();
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="text-white border-0 text-lg px-4 py-2"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {category.name} Articles
          </h1>
          
          {category.description && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
          
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {pagination.total} article{pagination.total !== 1 ? 's' : ''} in this category
          </p>
        </div>

        {/* Blog Grid with Filters and Pagination */}
        <BlogGrid
          initialPosts={posts.map(post => ({
            ...post,
            categories: post.categories?.[0] || null,
          }))}
          initialCategories={allCategories}
          initialPagination={pagination}
          initialFilters={{
            search,
            category: category.slug,
            featured: false,
            sortBy: 'newest',
          }}
        />
      </div>
    </PublicLayout>
  );
}
