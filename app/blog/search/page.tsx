import { PublicLayout } from '@/components/layout/public-layout';
import { BlogSearch } from '@/components/blog/blog-search';

export default async function SearchPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Search Articles
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find articles on topics that interest you. Search by title, content, or keywords.
          </p>
        </div>

        {/* Search Component */}
        <BlogSearch />
      </div>
    </PublicLayout>
  );
}
