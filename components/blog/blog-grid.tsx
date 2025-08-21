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
import { IconCalendar, IconEye, IconStar } from '@tabler/icons-react';

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
  initialPosts: BlogPost[];
  initialCategories: Category[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  initialFilters?: {
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
    <div className="space-y-8">
      {/* Filters */}
      <BlogFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        isLoading={isLoading}
      />

      {/* Results Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PaginationInfo
          currentPage={pagination.page}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
        
        {/* Active Filters Summary */}
        {(filters.search || filters.category || filters.featured) && (
          <div className="text-sm text-muted-foreground">
            {filters.search && `Search: "${filters.search}"`}
            {filters.category && ` • Category: ${categories.find(c => c.slug === filters.category)?.name}`}
            {filters.featured && ` • Featured only`}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
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
      ) : posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
              <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Featured Badge */}
                  {post.is_featured && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="gap-1">
                        <IconStar className="h-3 w-3" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Category Badge */}
                  {post.categories && (
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant="secondary" 
                        className="text-white border-0"
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
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <div className="w-full space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
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

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <IconCalendar className="h-3 w-3" />
                        <time dateTime={post.published_at}>
                          {formatDate(post.published_at)}
                        </time>
                      </div>
                      
                      {post.view_count && (
                        <div className="flex items-center gap-1">
                          <IconEye className="h-3 w-3" />
                          <span>{post.view_count.toLocaleString()} views</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              {filters.search || filters.category || filters.featured
                ? "Try adjusting your filters to see more results."
                : "No articles have been published yet. Please check back later!"
              }
            </p>
            {(filters.search || filters.category || filters.featured) && (
              <Button
                variant="outline"
                onClick={() => handleFilterChange({
                  search: '',
                  category: '',
                  featured: false,
                  sortBy: 'newest',
                })}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
