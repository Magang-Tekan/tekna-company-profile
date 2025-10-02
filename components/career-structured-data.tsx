interface CareerStructuredDataProps {
  readonly position: {
    readonly title: string;
    readonly slug: string;
    readonly summary?: string;
    readonly description?: string;
    readonly requirements?: string;
    readonly benefits?: string;
    readonly salary_min?: number;
    readonly salary_max?: number;
    readonly salary_currency?: string;
    readonly application_deadline?: string;
    readonly start_date?: string;
    readonly remote_allowed?: boolean;
    readonly category?: {
      readonly name: string;
    };
    readonly location?: {
      readonly name: string;
    };
    readonly type?: {
      readonly name: string;
    };
    readonly level?: {
      readonly name: string;
    };
    readonly created_at: string;
    readonly updated_at: string;
  };
  readonly siteUrl: string;
}

export function CareerStructuredData({
  position,
  siteUrl,
}: CareerStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: position.title,
    description: position.description || position.summary,
    identifier: {
      "@type": "PropertyValue",
      name: "Job ID",
      value: position.slug
    },
    datePosted: position.created_at,
    validThrough: position.application_deadline,
    employmentType: position.type?.name || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "PT. Sapujagat Nirmana Tekna",
      alternateName: "Tekna",
      url: siteUrl,
      logo: `${siteUrl}/logo.webp`,
      address: {
        "@type": "PostalAddress",
        addressLocality: position.location?.name || "Semarang",
        addressRegion: "Jawa Tengah",
        addressCountry: "ID"
      }
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: position.location?.name || "Semarang",
        addressRegion: "Jawa Tengah",
        addressCountry: "ID"
      }
    },
    baseSalary: position.salary_min ? {
      "@type": "MonetaryAmount",
      currency: position.salary_currency || "IDR",
      value: {
        "@type": "QuantitativeValue",
        minValue: position.salary_min,
        maxValue: position.salary_max,
        unitText: "MONTH"
      }
    } : undefined,
    jobBenefits: position.benefits,
    qualifications: position.requirements,
    responsibilities: position.description,
    workHours: "40 hours per week",
    url: `${siteUrl}/career/${position.slug}`,
    industry: "Software Development",
    occupationCategory: position.category?.name || "Software Developer"
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
