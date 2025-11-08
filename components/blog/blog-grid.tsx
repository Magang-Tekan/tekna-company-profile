"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogFilters } from "@/components/blog/blog-filters";
import { Pagination } from "@/components/blog/pagination";
import { BlogCard } from "@/components/blog/blog-card";
import { IconSearch, IconX } from "@tabler/icons-react";
import { prefetchBlogImages } from "@/lib/utils/image-prefetch";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  published_at: string;
  view_count: number | null;
  is_featured: boolean;
  category_id: string | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
}

interface BlogGridProps {
  readonly initialPosts: BlogPost[];
  readonly initialCategories: Category[];
  readonly initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  readonly initialFilters?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sortBy?: "newest" | "oldest" | "popular";
  };
}

export function BlogGrid({
  initialPosts,
  initialCategories,
  initialPagination,
  initialFilters = {},
}: BlogGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<Category[]>(initialCategories);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    category: initialFilters.category || "",
    featured: initialFilters.featured || false,
    sortBy: initialFilters.sortBy || ("newest" as const),
  });
  const [lastFetchKey, setLastFetchKey] = useState("");

  const fetchPosts = useCallback(
    async (newFilters = filters, page = 1) => {
      // Create a unique key for this fetch request
      const fetchKey = `${newFilters.search}-${newFilters.category}-${newFilters.featured}-${newFilters.sortBy}-${page}`;

      // Prevent duplicate requests
      if (fetchKey === lastFetchKey && !isLoading) {
        return;
      }

      setLastFetchKey(fetchKey);
      setIsLoading(true);

      try {
        // Import the server action dynamically
        const { getPaginatedBlogPosts } = await import("@/app/actions/blog");

        const result = await getPaginatedBlogPosts({
          page,
          limit: pagination.limit,
          search: newFilters.search,
          category: newFilters.category,
          featured: newFilters.featured,
        });

        // Transform the data to match our BlogPost interface
        const transformedPosts = result.data.map((post) => {
          // Fix: categories is already an object, not an array
          const categoryData =
            post.categories &&
            typeof post.categories === "object" &&
            !Array.isArray(post.categories)
              ? (post.categories as {
                  id: string;
                  name: string;
                  slug: string;
                  color: string;
                })
              : null;

          return {
            ...post,
            categories: categoryData,
          };
        });

        setPosts(transformedPosts);
        setPagination(result.pagination);

        // Prefetch images for better performance
        if (transformedPosts.length > 0) {
          prefetchBlogImages(transformedPosts).catch((error) => {
            console.warn("Failed to prefetch blog images:", error);
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.limit, lastFetchKey, isLoading]
  );

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      fetchPosts(newFilters, 1);
    },
    [fetchPosts]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      fetchPosts(filters, page);
    },
    [fetchPosts, filters]
  );

  // Initial fetch
  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchPosts(filters, 1);
    }
  }, [fetchPosts, filters, initialPosts.length]);

  // Prefetch initial posts images
  useEffect(() => {
    if (initialPosts.length > 0) {
      prefetchBlogImages(initialPosts).catch((error) => {
        console.warn("Failed to prefetch initial blog images:", error);
      });
    }
  }, [initialPosts]);

  return (
    <section className="space-y-6">
      {/* Blog Filters */}
      <BlogFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        isLoading={isLoading}
      />

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-muted-foreground">
          {isLoading ? "Loading..." : `${pagination.total} ${pagination.total === 1 ? "article" : "articles"} found`}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading blog articles"
        >
          {Array.from({ length: pagination.limit }, (_, index) => (
            <div key={`skeleton-${index}`} className="flex flex-col">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="p-4 pt-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              aria-label="Blog articles"
            >
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                  <IconSearch className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">No articles found</h3>
                  <p className="text-sm text-muted-foreground">
                    {filters.search || filters.category !== "all" || filters.featured
                      ? "Try adjusting your filters to see more results."
                      : "No articles have been published yet. Please check back later!"}
                  </p>
                </div>
                {(filters.search || filters.category !== "all" || filters.featured) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleFilterChange({
                        search: "",
                        category: "",
                        featured: false,
                        sortBy: "newest",
                      })
                    }
                    className="gap-2"
                  >
                    <IconX className="h-3.5 w-3.5" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <nav className="flex justify-center" aria-label="Blog pagination">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </nav>
        </div>
      )}
    </section>
  );
}
