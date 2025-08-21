'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { IconSearch, IconX, IconFilter } from '@tabler/icons-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface BlogFiltersProps {
  categories: Category[];
  onFilterChange: (filters: {
    search: string;
    category: string;
    featured: boolean;
    sortBy: 'newest' | 'oldest' | 'popular';
  }) => void;
  initialFilters?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sortBy?: 'newest' | 'oldest' | 'popular';
  };
  isLoading?: boolean;
}

export function BlogFilters({ 
  categories, 
  onFilterChange, 
  initialFilters = {},
  isLoading = false 
}: BlogFiltersProps) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    featured: initialFilters.featured || false,
    sortBy: initialFilters.sortBy || 'newest' as const,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleSortChange = (value: 'newest' | 'oldest' | 'popular') => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  const handleFeaturedToggle = () => {
    setFilters(prev => ({ ...prev, featured: !prev.featured }));
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      category: '',
      featured: false,
      sortBy: 'newest' as const,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = filters.search || filters.category || filters.featured;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar - Always Visible */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            {filters.search && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
              disabled={isLoading}
            >
              <IconFilter className="h-4 w-4" />
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {[filters.category, filters.featured].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={isLoading}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={handleCategoryChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={handleSortChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <Button
                    variant={filters.featured ? "default" : "outline"}
                    size="sm"
                    onClick={handleFeaturedToggle}
                    disabled={isLoading}
                    className="w-full justify-start"
                  >
                    {filters.featured ? '★ Featured Only' : '☆ All Articles'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.category && (
                <Badge variant="secondary" className="gap-2">
                  Category: {categories.find(c => c.slug === filters.category)?.name}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="hover:text-foreground"
                    disabled={isLoading}
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="gap-2">
                  Featured Articles
                  <button
                    onClick={handleFeaturedToggle}
                    className="hover:text-foreground"
                    disabled={isLoading}
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
