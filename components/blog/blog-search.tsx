'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { IconSearch, IconX } from '@tabler/icons-react';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  published_at: string;
  categories: {
    name: string;
    slug: string;
  } | null;
}

export function BlogSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Import the server action dynamically
      const { searchBlogPosts } = await import('@/app/actions/blog');
      
      const searchResults = await searchBlogPosts(searchQuery.trim());
      // Transform the results to match our interface
      const transformedResults = searchResults.map(result => ({
        ...result,
        categories: result.categories?.[0] || null,
      }));
      setResults(transformedResults);
    } catch (error) {
      console.error('Error searching posts:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Debounced search
    const timer = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-6">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            handleInputChange(value);
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Searching...</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && hasSearched && (
        <div className="space-y-4">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Found {results.length} article{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
              </p>
              
              <div className="space-y-4">
                {results.map((result) => (
                  <Link href={`/blog/${result.slug}`} key={result.id} className="block">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          {result.featured_image_url && (
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 relative rounded-md overflow-hidden">
                                <Image
                                  src={result.featured_image_url}
                                  alt={result.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary transition-colors">
                              {result.title}
                            </h3>
                            {result.excerpt && (
                              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                                {result.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatDate(result.published_at)}</span>
                              {result.categories && (
                                <>
                                  <span>•</span>
                                  <span>{result.categories.name}</span>
                                </>
                              )}
                              {result.author_name && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {result.author_name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn&apos;t find any articles matching &quot;{query}&quot;.
                </p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or browse all articles.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {!hasSearched && !query && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Search through our articles by title, content, or keywords.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Web Development', 'AI', 'Innovation', 'Design'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(term);
                    handleSearch(term);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
