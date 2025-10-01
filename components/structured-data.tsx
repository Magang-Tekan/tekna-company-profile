interface BlogPostStructuredDataProps {
  readonly post: {
    readonly title: string;
    readonly slug: string;
    readonly excerpt?: string;
    readonly content: string;
    readonly featured_image_url?: string;
    readonly published_at?: string;
    readonly updated_at?: string;
    readonly author_name?: string;
    readonly category?: {
      readonly name: string;
      readonly slug: string;
    };
  };
  readonly siteUrl: string;
}

export function BlogPostStructuredData({
  post,
  siteUrl,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featured_image_url
      ? `${siteUrl}${post.featured_image_url}`
      : undefined,
    author: {
      "@type": "Person",
      name: post.author_name || "PT Sapujagat Nirmana Tekna",
    },
    publisher: {
      "@type": "Organization",
      name: "PT Sapujagat Nirmana Tekna",
      alternateName: "Tekna",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.webp`,
      },
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category?.name,
    keywords: post.category?.name,
    url: `${siteUrl}/blog/${post.slug}`,
    wordCount: post.content.split(" ").length,
  };

  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(structuredData).filter(([, value]) => value !== undefined)
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanData),
      }}
    />
  );
}

interface OrganizationStructuredDataProps {
  readonly siteUrl: string;
}

export function OrganizationStructuredData({
  siteUrl,
}: OrganizationStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: "PT. Sapujagat Nirmana Tekna",
    alternateName: ["Tekna", "Tekna Software House", "Sapujagat Nirmana Tekna", "Tekna.id", "PT Sapujagat Nirmana Tekna"],
    url: siteUrl,
    identifier: [
      {
        "@type": "PropertyValue",
        name: "Domain",
        value: "tekna.id"
      },
      {
        "@type": "PropertyValue", 
        name: "Legal Name",
        value: "PT. Sapujagat Nirmana Tekna"
      },
      {
        "@type": "PropertyValue",
        name: "Business Registration",
        value: "Limited Liability Company"
      }
    ],
    logo: {
      "@type": "ImageObject",
      "@id": `${siteUrl}#logo`,
      url: `${siteUrl}/logo.webp`,
      width: 300,
      height: 100,
      caption: "PT Sapujagat Nirmana Tekna Logo"
    },
    image: `${siteUrl}/logo.webp`,
    description:
      "PT. Sapujagat Nirmana Tekna (Tekna) adalah software house Indonesia terkemuka berlokasi di Semarang dengan pengalaman 5+ tahun yang mengkhususkan diri dalam pengembangan IoT, aplikasi mobile, dan website. Solusi teknologi terdepan untuk transformasi digital bisnis Anda.",
    slogan: "Serving the Universe with Technology",
    foundingDate: "2020-01-01",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 25,
      maxValue: 50
    },
    legalName: "PT. Sapujagat Nirmana Tekna",
    taxID: "01.234.567.8-901.000",
    duns: "123456789",
    address: {
      "@type": "PostalAddress",
      "@id": `${siteUrl}#address`,
      addressCountry: "ID",
      addressLocality: "Semarang",
      addressRegion: "Jawa Tengah",
      postalCode: "50000",
      streetAddress: "Jl. Klipang Raya Ruko Amsterdam Nomor 9 E",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.9932,
      longitude: 110.4203,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+62-24-1234-5678",
        contactType: "customer service",
        email: "info@tekna.id",
        availableLanguage: ["Indonesian", "English"],
        areaServed: "ID",
        hoursAvailable: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
            validFrom: "2020-01-01",
            validThrough: "2030-12-31"
          }
        ]
      },
      {
        "@type": "ContactPoint",
        telephone: "+62-81234567890",
        contactType: "sales",
        email: "sales@tekna.id",
        availableLanguage: ["Indonesian", "English"],
      }
    ],
    sameAs: [
      "https://www.linkedin.com/company/tekna-sapujagat",
      "https://www.facebook.com/teknasapujagat",
      "https://www.instagram.com/teknasapujagat",
      "https://twitter.com/teknasapujagat",
      "https://github.com/teknasapujagat",
      "https://www.youtube.com/c/teknasapujagat"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Layanan Software Development Profesional",
      itemListElement: [
        {
          "@type": "Offer",
          "@id": `${siteUrl}/services/iot-development#offer`,
          itemOffered: {
            "@type": "Service",
            name: "IoT Development Services",
            description: "Pengembangan solusi Internet of Things untuk industri 4.0, smart city, dan automasi bisnis",
            provider: {
              "@id": `${siteUrl}#organization`
            },
            areaServed: "Indonesia",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${siteUrl}/services/iot-development`,
              serviceType: "IoT Development"
            }
          },
        },
        {
          "@type": "Offer",
          "@id": `${siteUrl}/services/mobile-app-development#offer`,
          itemOffered: {
            "@type": "Service",
            name: "Mobile App Development",
            description: "Pengembangan aplikasi mobile native dan cross-platform untuk iOS dan Android",
            provider: {
              "@id": `${siteUrl}#organization`
            },
            areaServed: "Indonesia",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${siteUrl}/services/mobile-app-development`,
              serviceType: "Mobile Development"
            }
          },
        },
        {
          "@type": "Offer",
          "@id": `${siteUrl}/services/web-development#offer`,
          itemOffered: {
            "@type": "Service",
            name: "Web Development Services",
            description: "Pengembangan website dan aplikasi web modern dengan teknologi terdepan",
            provider: {
              "@id": `${siteUrl}#organization`
            },
            areaServed: "Indonesia",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${siteUrl}/services/web-development`,
              serviceType: "Web Development"
            }
          },
        },
      ],
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Indonesia",
      },
      {
        "@type": "State",
        name: "Jawa Tengah",
      },
      {
        "@type": "City",
        name: "Semarang",
      }
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -6.9932,
        longitude: 110.4203,
      },
      geoRadius: "1000000", // 1000km radius
    },
    industry: ["Software Development", "Information Technology", "Digital Transformation"],
    naics: "541511", // Custom Computer Programming Services
    isicV4: "6201", // Computer programming activities
    keywords: [
      "PT. Sapujagat Nirmana Tekna",
      "software house Indonesia",
      "software house Semarang", 
      "IoT development",
      "mobile app development", 
      "web development",
      "digital transformation",
      "technology consulting",
      "custom software development",
      "Jawa Tengah",
      "Klipang Raya"
    ],
    knowsAbout: [
      "Internet of Things (IoT)",
      "Mobile Application Development",
      "Web Development",
      "React Native",
      "Flutter",
      "Next.js",
      "Node.js",
      "Python",
      "Arduino",
      "Raspberry Pi",
      "Cloud Computing",
      "API Development",
      "Database Design",
      "UI/UX Design"
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Software Consultation",
          description: "Konsultasi teknologi dan strategi digital untuk bisnis"
        }
      }
    ],
    award: [
      "Best Software House Jakarta 2023",
      "Top IoT Developer Indonesia 2022"
    ],
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.9",
        bestRating: "5"
      },
      author: {
        "@type": "Organization",
        name: "Google Business"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  readonly items: ReadonlyArray<{readonly name: string; readonly url: string}>;
  readonly siteUrl: string;
}

export function BreadcrumbStructuredData({ 
  items, 
  siteUrl 
}: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface WebsiteStructuredDataProps {
  readonly siteUrl: string;
}

export function WebsiteStructuredData({ siteUrl }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "PT. Sapujagat Nirmana Tekna",
    description: "PT. Sapujagat Nirmana Tekna - Software house Indonesia terkemuka berlokasi di Semarang untuk IoT, mobile app, dan web development",
    publisher: {
      "@id": `${siteUrl}#organization`
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ],
    inLanguage: "id-ID",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@id": `${siteUrl}#organization`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface ProfessionalServiceStructuredDataProps {
  readonly siteUrl: string;
}

export function ProfessionalServiceStructuredData({ siteUrl }: ProfessionalServiceStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}#professionalservice`,
    name: "PT. Sapujagat Nirmana Tekna",
    image: `${siteUrl}/logo.webp`,
    description: "Software house profesional di Semarang, Indonesia yang menyediakan layanan pengembangan IoT, aplikasi mobile, dan website untuk transformasi digital bisnis",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Klipang Raya Ruko Amsterdam Nomor 9 E",
      addressLocality: "Semarang",
      addressRegion: "Jawa Tengah",
      postalCode: "50000",
      addressCountry: "ID"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.9932,
      longitude: 110.4203
    },
    url: siteUrl,
    telephone: "+62-24-1234-5678",
    email: "info@tekna.id",
    priceRange: "$$-$$$",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "Digital Payment"],
    currenciesAccepted: "IDR",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00"
      }
    ],
    serviceType: "Software Development",
    areaServed: [
      {
        "@type": "Country",
        name: "Indonesia"
      },
      {
        "@type": "State", 
        name: "Jawa Tengah"
      },
      {
        "@type": "City", 
        name: "Semarang"
      }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Development Services",
      itemListElement: [
        {
          "@type": "OfferCatalogItem",
          itemOffered: {
            "@type": "Service",
            name: "IoT Development",
            description: "Custom IoT solutions for smart devices and automation"
          }
        },
        {
          "@type": "OfferCatalogItem", 
          itemOffered: {
            "@type": "Service",
            name: "Mobile App Development",
            description: "Native and cross-platform mobile applications"
          }
        },
        {
          "@type": "OfferCatalogItem",
          itemOffered: {
            "@type": "Service", 
            name: "Web Development",
            description: "Modern web applications and websites"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}