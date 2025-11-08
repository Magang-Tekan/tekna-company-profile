import { PublicService } from "@/lib/services/public.service";
import { AppHeader } from "@/components/layout/public-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Metadata } from "next";
import { prefetchBlogImages } from "@/lib/utils/image-prefetch";

// ISR: Revalidate every 30 minutes for blog listing
export const revalidate = 1800; // 30 minutes

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    featured?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Blog | Tekna - Insights & Latest News",
  description:
    "Explore our articles about technology, design, and innovation that shape the future of digital experiences.",
  keywords:
    "blog, technology, innovation, web development, AI, machine learning, digital solutions",
  openGraph: {
    title: "Blog | Tekna",
    description:
      "Explore our articles about technology, design, and innovation that shape the future of digital experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Tekna",
    description:
      "Explore our articles about technology, design, and innovation that shape the future of digital experiences.",
  },
};

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
    console.error("Error fetching blog data:", error);
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

export default async function BlogIndexPage({ searchParams }: Readonly<BlogPageProps>) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const search = resolvedSearchParams.search || "";
  const category = resolvedSearchParams.category || "";
  const featured = resolvedSearchParams.featured === "true";

  const { posts, pagination, categories } = await getBlogData({
    page,
    search,
    category,
    featured,
  });

  // Prefetch blog images for better performance
  if (posts && posts.length > 0) {
    try {
      await prefetchBlogImages(posts);
    } catch (error) {
      console.warn("Failed to prefetch blog images:", error);
      // Continue execution even if prefetch fails
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header like landing page */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <AppHeader />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Insights & Latest News</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore our articles about technology, design, and innovation that shape the future of digital experiences.
          </p>
        </div>

        {/* Blog Grid */}
        <main role="main" aria-label="Blog articles">
          <BlogGrid
            initialPosts={posts.map((post) => ({
              ...post,
              categories:
                post.categories &&
                typeof post.categories === "object" &&
                !Array.isArray(post.categories)
                  ? post.categories
                  : null,
            }))}
            initialCategories={categories}
            initialPagination={pagination}
            initialFilters={{
              search,
              category,
              featured,
              sortBy: "newest",
            }}
          />
        </main>
      </div>
    </div>
  );
}
