import { Metadata } from "next";
import { ProductsListingClient } from "@/components/products/products-listing-client";
import { PublicService } from "@/lib/services/public.service";
import { AppHeader } from "@/components/layout/public-header";
import { prefetchProjectImages } from "@/lib/utils/image-prefetch";

// ISR: Revalidate every hour for products listing
export const revalidate = 3600; // 1 hour

interface ProductData {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description?: string;
  is_featured: boolean;
  product_price?: string;
  created_at: string;
  updated_at: string;
}

export const metadata: Metadata = {
  title: "Our Products - PT Sapujagat Nirmana Tekna",
  description: "Explore our innovative products and solutions. From web applications to mobile apps, discover what we offer with transparent pricing.",
  keywords: "products, solutions, web development, mobile apps, pricing, PT Sapujagat Nirmana Tekna",
  openGraph: {
    title: "Our Products - PT Sapujagat Nirmana Tekna",
    description: "Explore our innovative products and solutions with transparent pricing.",
    type: "website",
    siteName: "PT Sapujagat Nirmana Tekna",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Products - PT Sapujagat Nirmana Tekna",
    description: "Explore our innovative products and solutions with transparent pricing.",
  },
  alternates: {
    canonical: "/products",
  },
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Readonly<ProductsPageProps>) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search;
  const featured = resolvedSearchParams.featured === "true";

  // Fetch initial products data (only products)
  const productsData = await PublicService.getAllProjects({
    page,
    limit: 12,
    search,
    featured: featured || undefined,
    isProduct: true, // Only get products
  });

  // Prefetch product images for better performance
  if (productsData.data && productsData.data.length > 0) {
    try {
      await prefetchProjectImages(productsData.data);
    } catch (error) {
      console.warn("Failed to prefetch product images:", error);
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
      <ProductsListingClient
        initialProducts={productsData.data}
        initialPagination={productsData.pagination}
      />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Our Products",
            description: "Explore our innovative products and solutions with transparent pricing.",
            url: "https://tekna.co.id/products",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: productsData.pagination.total,
              itemListElement: productsData.data.map((product: ProductData, index: number) => ({
                "@type": "Product",
                position: index + 1,
                name: product.name,
                description: product.description,
                url: `https://tekna.co.id/products/${product.slug}`,
                ...(product.featured_image_url && {
                  image: product.featured_image_url,
                }),
                ...(product.product_price && {
                  offers: {
                    "@type": "Offer",
                    price: product.product_price,
                    priceCurrency: "IDR",
                  },
                }),
                brand: {
                  "@type": "Organization",
                  name: "PT Sapujagat Nirmana Tekna",
                },
                dateCreated: product.created_at,
                dateModified: product.updated_at,
              })),
            },
            provider: {
              "@type": "Organization",
              name: "PT Sapujagat Nirmana Tekna",
              url: "https://tekna.co.id",
            },
          }),
        }}
      />
    </div>
  );
}

