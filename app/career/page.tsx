"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BackgroundPaths } from "@/components/ui/shadcn-io/background-paths";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Star,
  X,
  Building2,
  Users,
  TrendingUp,
  Send,
  UserPlus,
  Share2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  CareerService,
  CareerPosition,
  CareerCategory,
  CareerLocation,
  CareerType,
  CareerLevel,
  CareerSearchParams,
} from "@/lib/services/career";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ContentRenderer } from "@/components/content-renderer";
import { CareerStructuredData } from "@/components/career-structured-data";

export default function CareerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [featuredPositions, setFeaturedPositions] = useState<CareerPosition[]>([]);
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [locations, setLocations] = useState<CareerLocation[]>([]);
  const [types, setTypes] = useState<CareerType[]>([]);
  const [levels, setLevels] = useState<CareerLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState<CareerSearchParams>({
    page: 1,
    limit: 12,
    sort: "newest",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<CareerPosition | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    cover_letter: "",
    resume_url: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    source: "website",
  });

  const careerService = useMemo(() => new CareerService(), []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update search params when debounced query changes
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        search: debouncedSearchQuery || undefined,
      },
      page: 1,
    }));
  }, [debouncedSearchQuery]);

  const loadInitialData = useCallback(async () => {
    try {
      const [categoriesData, locationsData, typesData, levelsData, featuredData] = await Promise.all([
        careerService.getPublicCategories(),
        careerService.getPublicLocations(),
        careerService.getPublicTypes(),
        careerService.getPublicLevels(),
        careerService.getFeaturedPositions(6),
      ]);

      setCategories(categoriesData);
      setLocations(locationsData);
      setTypes(typesData);
      setLevels(levelsData);
      setFeaturedPositions(featuredData);
      
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "❌ Data Loading Failed",
        description: "Some career data failed to load. Please refresh the page.",
      });
    }
  }, [careerService, toast]);

  const loadPositions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await careerService.getPublicPositions(searchParams);
      
      setPositions(result.positions);
      setTotalCount(result.total);
      setTotalPages(result.totalPages);

      // Auto-select first position only if no position is currently selected
      if (result.positions.length > 0 && !selectedPosition) {
        setSelectedPosition(result.positions[0]);
      }
    } catch (error) {
      console.error("Error loading positions:", error);
      toast({
        title: "❌ Loading Failed",
        description: "Failed to load positions. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  }, [careerService, searchParams, selectedPosition, toast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const handleSearch = (search: string) => {
    setSearchQuery(search);
    
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all") {
      setSearchParams((prev) => ({
        ...prev,
        filters: { ...prev.filters, [key as keyof typeof prev.filters]: undefined },
        page: 1,
      }));
      
      return;
    }

    setSearchParams((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key as keyof typeof prev.filters]: value },
      page: 1,
    }));
    
  };

  const handleSortChange = (sort: string) => {
    setSearchParams((prev) => ({
      ...prev,
      sort: sort as "newest" | "oldest" | "title" | "salary_high" | "salary_low" | "deadline",
      page: 1,
    }));
    
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
    
  };

  const handlePositionSelect = (position: CareerPosition) => {
    // On mobile, redirect to individual career page
    if (window.innerWidth < 1024) {
      router.push(`/career/${position.slug}`);
      return;
    }
    
    // On desktop, show in sidebar
    setSelectedPosition(position);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchParams({ page: 1, limit: 12, sort: "newest" });
    
    toast({
      title: "🔄 Filters Reset",
      description: "All filters have been cleared. Showing all positions.",
    });
  };

  const hasActiveFilters = () => {
    return !!(
      searchQuery ||
      searchParams.filters?.category ||
      searchParams.filters?.location ||
      searchParams.filters?.type ||
      searchParams.filters?.level ||
      searchParams.filters?.remote
    );
  };

  const formatSalary = (min?: number, max?: number, currency = "IDR") => {
    if (!min && !max) return "Salary not disclosed";
    const format = (amount: number) => {
      if (currency === "IDR") return `Rp ${(amount / 1000000).toFixed(0)}M`;
      return `$${(amount / 1000).toFixed(0)}K`;
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition) return;

    setApplying(true);
    try {
      const application = {
        position_id: selectedPosition.id,
        ...applicationData,
      };

      const result = await careerService.submitApplication(application);

      if (result.success) {
        setShowApplicationForm(false);
        setApplicationData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          cover_letter: "",
          resume_url: "",
          portfolio_url: "",
          linkedin_url: "",
          github_url: "",
          source: "website",
        });

        toast({
          title: "🎉 Application Submitted Successfully!",
          description: "Thank you for your interest! You will receive a confirmation email shortly.",
        });
      } else {
        console.error("Application submission failed:", result.error);
        throw new Error(result.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMessage = "Failed to submit application. Please try again.";
      if (error instanceof Error && error.message) {
        errorMessage = `Failed to submit application: ${error.message}`;
      }

      toast({
        title: "❌ Submission Failed",
        description: errorMessage,
      });
    } finally {
      setApplying(false);
    }
  };

  const sharePosition = async () => {
    if (!selectedPosition) return;

    const shareData = {
      title: `${selectedPosition.title} - Career Opportunity`,
      text: selectedPosition.description 
        ? `${selectedPosition.description.substring(0, 150)}...`
        : `Check out this ${selectedPosition.title} position at our company!`,
      url: window.location.href,
    };

    try {
      // Try native sharing first (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareSuccess(true);
        toast({
          title: "📤 Shared Successfully!",
          description: "Position shared with your contacts.",
        });
        
        // Reset share success state after 3 seconds
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        toast({
          title: "📋 URL Copied!",
          description: "Position URL copied to clipboard. You can now share it manually.",
        });
        
        // Reset share success state after 3 seconds
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error sharing position:", error);
      
      // Final fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        toast({
          title: "📋 URL Copied!",
          description: "Position URL copied to clipboard. You can now share it manually.",
        });
        
        // Reset share success state after 3 seconds
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (clipboardError) {
        console.error("Clipboard copy failed:", clipboardError);
        setShareSuccess(false);
        toast({
          title: "❌ Sharing Failed",
          description: "Unable to share or copy URL. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Career Structured Data */}
      {positions.length > 0 && (
        <CareerStructuredData
          position={{
            title: "Lowongan Kerja Tekna",
            slug: "career",
            summary: "Temukan lowongan kerja terbaru di Tekna",
            description: "Bergabunglah dengan tim Tekna! Temukan lowongan kerja terbaru di software house Indonesia terkemuka.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }}
          siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "https://tekna.id"}
        />
      )}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <BackgroundPaths />
        <div className="relative z-10 container mx-auto px-4 py-12 md:px-6 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent mb-6">
              Find Your Dream Career
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Join our innovative team and shape the future of technology.
              Discover opportunities that match your passion and skills.
            </p>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5" />
                <Input
                  placeholder="Search jobs, skills, or companies..."
                  className="pl-12 pr-4 h-12 bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30 focus:ring-2 focus:ring-primary-foreground/50 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              {/* Search Suggestions - Mobile Only */}
              <div className="lg:hidden mt-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.slice(0, 4).map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFilterChange("category", category.slug)}
                      className="text-xs h-7 px-2 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      {category.name}
                    </Button>
                  ))}
                  {locations.slice(0, 3).map((location) => (
                    <Button
                      key={location.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFilterChange("location", location.slug)}
                      className="text-xs h-7 px-2 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      {location.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <Building2 className="w-4 h-4" />
                <span>{totalCount} Open Positions</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span>{categories.length} Departments</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>{locations.length} Locations</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>{featuredPositions.length} Featured Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Jobstreet Style Layout */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/5">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
              <Briefcase className="w-4 h-4" />
              Career Opportunities
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent mb-6">
              Available Positions
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Discover opportunities that match your skills and aspirations
            </p>
          </div>

          {/* Mobile Sticky Header */}
          <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b mb-6 -mx-4 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  {totalCount} Jobs Available
                </span>
              </div>
              <Select value={searchParams.sort || "newest"} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32 h-8 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">A-Z</SelectItem>
                  <SelectItem value="salary_high">High Salary</SelectItem>
                  <SelectItem value="salary_low">Low Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters Section - Moved to top */}
          <div className="mb-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between"
              >
                <span>Filters & Search</span>
                <span className={showFilters ? "rotate-180" : ""}>▼</span>
              </Button>
            </div>

            <div className={cn(
              "bg-card rounded-lg border shadow-sm p-6",
              "lg:block",
              showFilters ? "block" : "hidden"
            )}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-auto px-2 py-1 rounded-md text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: "category" as const, label: "Category", options: categories },
                  { key: "location" as const, label: "Location", options: locations },
                  { key: "type" as const, label: "Job Type", options: types },
                  { key: "level" as const, label: "Experience Level", options: levels },
                ].map(({ key, label, options }) => (
                  <div key={label}>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {label}
                    </label>
                    <Select
                      value={searchParams.filters?.[key] || "all"}
                      onValueChange={(value) => handleFilterChange(key, value)}
                    >
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue placeholder={`All ${label}s`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {label}s</SelectItem>
                        {options.map((option) => (
                          <SelectItem key={option.id} value={option.slug}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Job Listings */}
            <div className="w-full lg:w-2/5">
              {/* Job Listings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {totalCount} Jobs
                  </h3>
                  <Select value={searchParams.sort || "newest"} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-40 h-9 rounded-lg text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Latest Posts</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Alphabetical</SelectItem>
                      <SelectItem value="salary_high">Highest Salary</SelectItem>
                      <SelectItem value="salary_low">Lowest Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Search Results Info */}
                {hasActiveFilters() && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg border">
                    <p className="text-sm text-muted-foreground text-center">
                      🔍 Showing {positions.length} of {totalCount} positions
                      {searchQuery && ` matching "${searchQuery}"`}
                      {searchParams.filters?.category && ` in ${categories.find(c => c.slug === searchParams.filters?.category)?.name}`}
                      {searchParams.filters?.location && ` at ${locations.find(l => l.slug === searchParams.filters?.location)?.name}`}
                    </p>
                  </div>
                )}

                {/* Mobile Instructions */}
                <div className="lg:hidden bg-muted/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground text-center">
                    💡 Tap on a job card to view full details and apply
                  </p>
                </div>

                {/* Mobile Quick Actions */}
                <div className="lg:hidden mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="whitespace-nowrap flex-shrink-0"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {showFilters ? "Hide" : "Show"} Filters
                    </Button>
                    {hasActiveFilters() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="whitespace-nowrap flex-shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Job Cards */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-muted-foreground mb-2">Loading positions...</p>
                    <p className="text-xs text-muted-foreground">
                      💡 This may take a few moments
                    </p>
                  </div>
                ) : positions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No positions found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {hasActiveFilters() ? "Try adjusting your filters." : "Check back later for new opportunities!"}
                    </p>
                    {hasActiveFilters() && (
                      <div className="space-y-3">
                        <Button
                          onClick={clearFilters}
                          className="w-full sm:w-auto"
                          variant="outline"
                        >
                          Clear All Filters
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          💡 Try removing some filters to see more positions
                        </p>
                      </div>
                    )}
                    {!hasActiveFilters() && (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          💡 No open positions available at the moment
                        </p>
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Page
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[900px] overflow-y-auto">
                    {/* Mobile Pull to Refresh Indicator */}
                    <div className="lg:hidden text-center py-2 text-xs text-muted-foreground">
                      ↓ Pull down to refresh
                    </div>
                    
                    {positions.map((position) => (
                      <Card
                        key={position.id}
                        className={cn(
                          "group cursor-pointer transition-all duration-200 border hover:border-primary/30 hover:shadow-md",
                          selectedPosition?.id === position.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border"
                        )}
                        onClick={() => handlePositionSelect(position)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-muted-foreground" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                  {position.title}
                                </h4>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                Company Name
                              </p>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{position.location?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{position.type?.name}</span>
                                </div>
                              </div>

                              {position.salary_min || position.salary_max ? (
                                <p className="text-sm font-medium text-primary mb-2">
                                  {formatSalary(position.salary_min, position.salary_max, position.salary_currency)}
                                </p>
                              ) : null}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {position.featured && (
                                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary">
                                      <Star className="w-3 h-3 mr-1 fill-current" />
                                      Featured
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs px-2 py-1">
                                    {position.level?.name}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(position.created_at)}
                                  </span>
                                  {/* Mobile View Details Button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/career/${position.slug}`);
                                    }}
                                    className="lg:hidden h-7 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Mobile Apply Button */}
                              <div className="lg:hidden mt-3 pt-3 border-t border-border">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/career/${position.slug}`);
                                  }}
                                  className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium"
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Apply Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={searchParams.page === 1}
                        onClick={() => handlePageChange((searchParams.page || 1) - 1)}
                        className="h-9 px-3"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-3">
                        Page {searchParams.page || 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={searchParams.page === totalPages}
                        onClick={() => handlePageChange((searchParams.page || 1) + 1)}
                        className="h-9 px-3"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Mobile Load More Button */}
                {totalPages > 1 && (
                  <div className="lg:hidden mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange((searchParams.page || 1) + 1)}
                      disabled={searchParams.page === totalPages}
                      className="w-full"
                    >
                      {searchParams.page === totalPages ? "No More Jobs" : "Load More Jobs"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Job Details - Hidden on Mobile */}
            <div className="hidden lg:block lg:w-3/5">
              {selectedPosition ? (
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  {/* Job Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {selectedPosition.featured && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            >
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}
                          {selectedPosition.urgent && (
                            <Badge variant="destructive">
                              <Clock className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                          <Badge
                            variant={
                              selectedPosition.status === "open"
                                ? "default"
                                : selectedPosition.status === "closed"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {selectedPosition.status}
                          </Badge>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          {selectedPosition.title}
                        </h2>


                        <div className="text-lg font-semibold text-primary">
                          {formatSalary(
                            selectedPosition.salary_min,
                            selectedPosition.salary_max,
                            selectedPosition.salary_currency
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={sharePosition} variant="outline" size="sm">
                          {shareSuccess ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          ) : (
                            <Share2 className="w-4 h-4 mr-2" />
                          )}
                          {shareSuccess ? "Shared!" : "Share"}
                        </Button>
                        <Button
                          onClick={() => setShowApplicationForm(true)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Position Details Sidebar - Moved to top */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-muted/30 rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Department</h4>
                      <p className="text-foreground">{selectedPosition.category?.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
                      <p className="text-foreground">{selectedPosition.location?.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Employment Type</h4>
                      <p className="text-foreground">{selectedPosition.type?.name}</p>
                    </div>
                    {selectedPosition.level && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Experience Level</h4>
                        <p className="text-foreground">{selectedPosition.level.name}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Posted</h4>
                      <p className="text-foreground">{new Date(selectedPosition.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Job Description</h3>
                    <div className="prose prose-sm max-w-none">
                      <ContentRenderer 
                        content={selectedPosition.description || "No description available."} 
                        contentType="markdown"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  {selectedPosition.requirements && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Requirements</h3>
                      <div className="prose prose-sm max-w-none">
                        <ContentRenderer 
                          content={selectedPosition.requirements} 
                          contentType="markdown"
                        />
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedPosition.benefits && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Benefits & Perks</h3>
                      <div className="prose prose-sm max-w-none">
                        <ContentRenderer 
                          content={selectedPosition.benefits} 
                          contentType="markdown"
                        />
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedPosition.skills && selectedPosition.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPosition.skills.map((skillItem) => (
                          <Badge
                            key={skillItem.id}
                            variant={skillItem.level === "required" ? "default" : "secondary"}
                            className={cn(
                              "text-sm px-3 py-1.5",
                              skillItem.level === "required"
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-muted/50 text-muted-foreground border border-border"
                            )}
                          >
                            {skillItem.skill?.name}
                            {skillItem.level === "required" && " *"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-card rounded-lg border shadow-sm p-12 text-center">
                  <div className="w-24 h-24 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-6">
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Select a Position</h3>
                  <p className="text-muted-foreground">Choose a job from the list to view details and apply</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Apply for {selectedPosition.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowApplicationForm(false);
                  }}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      First Name *
                    </label>
                    <Input
                      value={applicationData.first_name}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      Last Name *
                    </label>
                    <Input
                      value={applicationData.last_name}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Cover Letter
                  </label>
                  <Textarea
                    value={applicationData.cover_letter}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        cover_letter: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Tell us why you're perfect for this role..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Resume URL
                  </label>
                  <Input
                    type="url"
                    value={applicationData.resume_url}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        resume_url: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      Portfolio URL
                    </label>
                    <Input
                      type="url"
                      value={applicationData.portfolio_url}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          portfolio_url: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      LinkedIn URL
                    </label>
                    <Input
                      type="url"
                      value={applicationData.linkedin_url}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          linkedin_url: e.target.value,
                        }))
                      }
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    GitHub URL
                  </label>
                  <Input
                    type="url"
                    value={applicationData.github_url}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        github_url: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowApplicationForm(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={applying}
                    className="flex-1"
                    onClick={() => {
                      if (!applicationData.first_name || !applicationData.last_name || !applicationData.email) {
                        toast({
                          title: "⚠️ Required Fields Missing",
                          description: "Please fill in all required fields (First Name, Last Name, Email).",
                        });
                      }
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {applying ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => {
            if (positions.length > 0) {
              router.push(`/career/${positions[0].slug}`);
            }
          }}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Briefcase className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
