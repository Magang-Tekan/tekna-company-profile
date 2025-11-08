"use client";

import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Grid,
  List,
  Calendar,
  Star,
  Tag,
} from "lucide-react";
import { ClientPublicService } from "@/lib/services/client-public.service";

interface Product {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_price?: string;
  meta_title?: string;
  meta_description?: string;
}

interface ProductsListingClientProps {
  initialProducts: Product[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "featured";

// Extracted components for better performance and linting compliance
const ProductCard = ({ product }: { readonly product: Product }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="h-full"
  >
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden aspect-video">
        <ImageWithFallback
          src={product.featured_image_url ?? null}
          alt={product.name}
          fill
          size="large"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.is_featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </CardTitle>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(product.created_at).toLocaleDateString()}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <CardDescription className="line-clamp-2 text-sm">
          {product.short_description || product.description}
        </CardDescription>

        {/* Price Display */}
        {product.product_price && (
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <Tag className="w-4 h-4" />
            <span>{product.product_price}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild size="sm" className="w-full">
            <Link href={`/products/${product.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ProductListItem = ({ product }: { readonly product: Product }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-lg">
            <ImageWithFallback
              src={product.featured_image_url ?? null}
              alt={product.name}
              fill
              size="small"
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base hover:text-primary transition-colors">
                <Link href={`/products/${product.slug}`}>
                  {product.name}
                </Link>
              </h3>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {product.is_featured && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {product.short_description || product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(product.created_at).toLocaleDateString()}
                </div>
                {product.product_price && (
                  <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                    <Tag className="w-3 h-3" />
                    <span>{product.product_price}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/products/${product.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingSkeleton = ({ viewMode }: { readonly viewMode: ViewMode }) => (
  <div className="space-y-6">
    {viewMode === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={`grid-skeleton-${i}`} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={`list-skeleton-${i}`}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

interface PaginationProps {
  pagination: {
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const ProductPagination = ({ 
  pagination, 
  currentPage, 
  loading, 
  onPageChange 
}: Readonly<PaginationProps>) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrev || loading}
      >
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let page = i + 1;
          if (pagination.totalPages > 5) {
            if (currentPage > 3) {
              page = currentPage - 2 + i;
            }
            if (page > pagination.totalPages) {
              page = pagination.totalPages - 4 + i;
            }
          }
          
          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
            >
              {page}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNext || loading}
      >
        Next
      </Button>
    </div>
  );
};

export function ProductsListingClient({
  initialProducts,
  initialPagination,
}: Readonly<ProductsListingClientProps>) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const handleSearch = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await ClientPublicService.getAllProjects({
        page: currentPage,
        limit: 12,
        search: searchQuery.trim() || undefined,
        featured: showFeaturedOnly || undefined,
        isProduct: true, // Only get products
      });

      setProducts(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, showFeaturedOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "" || currentPage !== 1 || showFeaturedOnly) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, showFeaturedOnly, handleSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleFeaturedFilterChange = (showFeatured: boolean) => {
    setShowFeaturedOnly(showFeatured);
    setCurrentPage(1);
  };

  // Sort products client-side for immediate feedback
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "featured":
      default:
        return sorted.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return a.sort_order - b.sort_order;
        });
    }
  }, [products, sortBy]);

  // Helper functions for render logic
  const getResultsText = () => {
    if (loading) return "Loading...";
    const productText = pagination.total === 1 ? "product" : "products";
    return `${pagination.total} ${productText} found`;
  };

  const renderProducts = () => {
    if (loading) {
      return <LoadingSkeleton viewMode={viewMode} />;
    }

    if (sortedProducts.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium mb-1">No products found</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {searchQuery
              ? `No products match "${searchQuery}". Try adjusting your search terms.`
              : "No products are available at the moment."}
          </p>
          {searchQuery && (
            <Button size="sm" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      );
    }

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sortedProducts.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Explore our innovative products and solutions with transparent pricing.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-2 mb-6 pb-4 border-b border-border/40">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-3.5 h-3.5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none border-b border-transparent focus-visible:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap lg:flex-nowrap">
          <Select value={showFeaturedOnly.toString()} onValueChange={(value) => handleFeaturedFilterChange(value === "true")}>
            <SelectTrigger className="w-full lg:w-auto h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 rounded-none border-b border-transparent focus:border-primary/50 transition-colors px-2">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">All Products</SelectItem>
              <SelectItem value="true">Featured Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: SortBy) => handleSortChange(value)}>
            <SelectTrigger className="w-full lg:w-auto h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 rounded-none border-b border-transparent focus:border-primary/50 transition-colors px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Latest First</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex rounded-none border-0 border-b border-transparent">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeChange("grid")}
              className={`h-9 px-2 rounded-none border-b-2 transition-colors ${
                viewMode === "grid"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className={`h-9 px-2 rounded-none border-b-2 transition-colors ${
                viewMode === "list"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-muted-foreground">
          {getResultsText()}
          {showFeaturedOnly && " (featured only)"}
        </div>
      </div>

      {/* Products Display */}
      {renderProducts()}

      {/* Pagination */}
      {sortedProducts.length > 0 && (
        <div className="mt-6">
          <ProductPagination 
            pagination={pagination}
            currentPage={currentPage}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

