"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconX } from "@tabler/icons-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

type SortOption = "newest" | "oldest" | "popular";

interface BlogFiltersProps {
  readonly categories: Category[];
  onFilterChange: (filters: {
    search: string;
    category: string;
    featured: boolean;
    sortBy: SortOption;
  }) => void;
  readonly initialFilters?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sortBy?: SortOption;
  };
  readonly isLoading?: boolean;
}

export function BlogFilters({
  categories,
  onFilterChange,
  initialFilters = {},
  isLoading = false,
}: BlogFiltersProps) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    category: initialFilters.category || "all",
    featured: initialFilters.featured || false,
    sortBy: initialFilters.sortBy || ("newest" as const),
  });

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
    // Auto-trigger for category changes
    onFilterChange({
      ...filters,
      category: value === "all" ? "" : value,
    });
  };

  const handleSortChange = (value: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
    // Auto-trigger for sort changes
    onFilterChange({
      ...filters,
      sortBy: value,
    });
  };

  const handleFeaturedToggle = () => {
    const newFeatured = !filters.featured;
    setFilters((prev) => ({ ...prev, featured: newFeatured }));
    // Auto-trigger for featured changes
    onFilterChange({
      ...filters,
      featured: newFeatured,
    });
  };

  const handleSearch = () => {
    onFilterChange({
      ...filters,
      category: filters.category === "all" ? "" : filters.category,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 mb-6 pb-4 border-b border-border/40">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <label htmlFor="blog-search" className="sr-only">
            Search articles by title, content, or keywords
          </label>
          <IconSearch
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-3.5 h-3.5"
            aria-hidden="true"
          />
          <Input
            id="blog-search"
            placeholder="Search articles..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="pl-8 h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none border-b border-transparent focus-visible:border-primary/50 transition-colors"
            disabled={isLoading}
            aria-describedby={
              filters.search ? "search-description" : undefined
            }
          />

          {filters.search && (
            <>
              <button
                onClick={() => {
                  handleSearchChange("");
                  onFilterChange({
                    ...filters,
                    search: "",
                    category:
                      filters.category === "all" ? "" : filters.category,
                  });
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                disabled={isLoading}
                aria-label="Clear search"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
              <div id="search-description" className="sr-only">
                Search results are being filtered by: {filters.search}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap lg:flex-nowrap">
        <Select value={filters.category} onValueChange={handleCategoryChange} disabled={isLoading}>
          <SelectTrigger className="w-full lg:w-auto h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 rounded-none border-b border-transparent focus:border-primary/50 transition-colors px-2">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={handleSortChange} disabled={isLoading}>
          <SelectTrigger className="w-full lg:w-auto h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 rounded-none border-b border-transparent focus:border-primary/50 transition-colors px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleFeaturedToggle}
          disabled={isLoading}
          className={`h-9 px-2 rounded-none border-b-2 transition-colors ${
            filters.featured
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={filters.featured}
        >
          Featured
        </Button>
      </div>
    </div>
  );
}
