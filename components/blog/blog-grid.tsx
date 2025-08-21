'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogFilters } from '@/components/blog/blog-filters';
import { Pagination, PaginationInfo } from '@/components/blog/pagination';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import Link from 'next/link';
import { IconCalendar, IconEye, IconStar, IconSearch, IconX } from '@tabler/icons-react';

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
    sortBy?: 'newest' | 'oldest' | 'popular';
  };
}

export function BlogGrid({ 
  initialPosts, 
  initialCategories, 
  initialPagination,
  initialFilters = {}
}: BlogGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<Category[]>(initialCategories);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    featured: initialFilters.featured || false,
    sortBy: initialFilters.sortBy || 'newest' as const,
  });
  const [lastFetchKey, setLastFetchKey] = useState('');

  const fetchPosts = useCallback(async (newFilters = filters, page = 1) => {
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
      const { getPaginatedBlogPosts } = await import('@/app/actions/blog');
      
      const result = await getPaginatedBlogPosts({
        page,
        limit: pagination.limit,
        search: newFilters.search,
        category: newFilters.category,
        featured: newFilters.featured,
      });

      setPosts(result.data.map(post => ({
        ...post,
        categories: post.categories?.[0] || null,
      })));
      setPagination(result.pagination);

      // Update URL without refresh
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        if (newFilters.search) url.searchParams.set('search', newFilters.search);
        else url.searchParams.delete('search');
        if (newFilters.category) url.searchParams.set('category', newFilters.category);
        else url.searchParams.delete('category');
        if (newFilters.featured) url.searchParams.set('featured', 'true');
        else url.searchParams.delete('featured');
        
        window.history.replaceState({}, '', url.toString());
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit, lastFetchKey, isLoading]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchPosts(newFilters, 1); // Reset to page 1 when filters change
  }, [fetchPosts]);

  const handlePageChange = useCallback((page: number) => {
    fetchPosts(filters, page);
    // Scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchPosts, filters]);

  const getAuthorInitials = (authorName: string) => {
    if (!authorName) return 'AD';
    const names = authorName.trim().split(' ');
    const firstInitial = names[0] ? names[0].charAt(0) : '';
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="space-y-8" aria-label="Blog articles and filters">
      {/* Enhanced Filters with better accessibility */}
      <BlogFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        isLoading={isLoading}
      />

      {/* Enhanced Results Info with better visual hierarchy */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg border">
        <PaginationInfo
          currentPage={pagination.page}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
        
        {/* Active Filters Summary with enhanced styling */}
        {(filters.search || filters.category || filters.featured) && (
          <div className="text-sm text-muted-foreground bg-background px-3 py-1.5 rounded-md border">
            {filters.search && (
              <span className="font-medium">Search: <em>&quot;{filters.search}&quot;</em></span>
            )}
            {filters.category && (
              <span className="font-medium">
                {filters.search ? ' • ' : ''}Category: {categories.find(c => c.slug === filters.category)?.name}
              </span>
            )}
            {filters.featured && (
              <span className="font-medium">
                {(filters.search || filters.category) ? ' • ' : ''}Featured only
              </span>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Posts Grid with better loading states */}
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-live="polite" aria-label="Loading articles">
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((skeletonId) => (
            <Card key={skeletonId} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-label="Blog articles">
              {posts.map((post) => (
                <article key={post.id} className="flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2">
                      <CardHeader className="p-0 relative">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          />
                        </div>
                        
                        {/* Enhanced Feature Badge with better contrast */}
                        {post.is_featured && (
                          <div className="absolute top-4 left-4">
                            <Badge variant="default" className="gap-1 shadow-lg">
                              <IconStar className="h-3 w-3" aria-hidden="true" />
                              <span className="sr-only">Featured article:</span>
                              <span>Featured</span>
                            </Badge>
                          </div>
                        )}

                        {/* Enhanced Category Badge with better styling */}
                        {post.categories && (
                          <div className="absolute top-4 right-4">
                            <Badge 
                              variant="secondary" 
                              className="text-white border-0 shadow-lg font-medium"
                              style={{ backgroundColor: post.categories.color }}
                            >
                              {post.categories.name}
                            </Badge>
                          </div>
                        )}
                      </CardHeader>

                      <CardContent className="p-6">
                        <CardTitle className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                          {post.title}
                        </CardTitle>
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </CardContent>

                      <CardFooter className="p-6 pt-0 mt-auto">
                        <div className="w-full space-y-4">
                          {/* Enhanced Author Info with better spacing */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-muted">
                              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                {getAuthorInitials(post.author_name || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm">
                                {post.author_name || 'Admin'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Content Writer
                              </p>
                            </div>
                          </div>

                          {/* Enhanced Meta Info with better visual hierarchy */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                            <div className="flex items-center gap-1">
                              <IconCalendar className="h-3 w-3" aria-hidden="true" />
                              <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                              </time>
                            </div>
                            
                            {post.view_count && (
                              <div className="flex items-center gap-1">
                                <IconEye className="h-3 w-3" aria-hidden="true" />
                                <span>{post.view_count.toLocaleString()} views</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                  <IconSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No articles found</h3>
                  <p className="text-muted-foreground">
                    {filters.search || filters.category || filters.featured
                      ? "Try adjusting your filters to see more results."
                      : "No articles have been published yet. Please check back later!"
                    }
                  </p>
                </div>
                {(filters.search || filters.category || filters.featured) && (
                  <Button
                    variant="outline"
                    onClick={() => handleFilterChange({
                      search: '',
                      category: '',
                      featured: false,
                      sortBy: 'newest',
                    })}
                    className="gap-2"
                  >
                    <IconX className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Enhanced Pagination with better accessibility */}
      {pagination.totalPages > 1 && (
        <nav className="flex justify-center mt-12" aria-label="Blog pagination">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </nav>
      )}
    </section>
  );
}
