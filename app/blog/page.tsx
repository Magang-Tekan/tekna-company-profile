import { PublicService } from '@/lib/services/public.service';
import { PublicLayout } from '@/components/layout/public-layout';
import { BlogGrid } from '@/components/blog/blog-grid';

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    featured?: string;
  }>;
}

async function getBlogData(params: {
  page?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  try {
    const [postsResult, categories] = await Promise.all([
      PublicService.getPaginatedPublishedPosts(params),
      PublicService.getActiveCategories(),
    ]);
    
    return {
      posts: postsResult.data,
      pagination: postsResult.pagination,
      categories,
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      categories: [],
    };
  }
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';
  const category = resolvedSearchParams.category || '';
  const featured = resolvedSearchParams.featured === 'true';

  const { posts, pagination, categories } = await getBlogData({
    page,
    search,
    category,
    featured,
  });

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Insights & Latest News
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore our articles about technology, design, and innovation that shape the future.
          </p>
        </div>

        {/* Blog Grid with Filters and Pagination */}
        <BlogGrid
          initialPosts={posts.map(post => ({
            ...post,
            categories: post.categories?.[0] || null,
          }))}
          initialCategories={categories}
          initialPagination={pagination}
          initialFilters={{
            search,
            category,
            featured,
            sortBy: 'newest',
          }}
        />
      </div>
    </PublicLayout>
  );
}
