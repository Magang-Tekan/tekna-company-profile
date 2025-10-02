import { Metadata } from "next";
import { CareerService } from "@/lib/services/career";

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CareerDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const careerService = new CareerService();
    const position = await careerService.getPublicPositionBySlug(slug);

    if (!position) {
      return {
        title: "Lowongan Kerja Tidak Ditemukan | Tekna Career",
        description: "Lowongan kerja yang Anda cari tidak ditemukan.",
      };
    }

    const title = position.seo_title || `${position.title} - Lowongan Kerja Tekna | ${position.location?.name || 'Semarang'}`;
    const salaryText = position.salary_min 
      ? `Rp ${position.salary_min.toLocaleString('id-ID')}` 
      : 'kompetitif';
    const summaryText = position.summary?.substring(0, 120) || '';
    const locationText = position.location?.name || 'Semarang';
    
    const description = position.seo_description || 
      `Bergabunglah sebagai ${position.title} di Tekna! ${summaryText}... Gaji ${salaryText}. Lokasi: ${locationText}.`;
    const keywords = position.seo_keywords || [
      `lowongan kerja ${position.title}`,
      `karir ${position.title} semarang`,
      `lowongan ${position.title} tekna`,
      `jobs ${position.title} indonesia`,
      `career ${position.title} semarang`,
      "lowongan kerja tekna",
      "karir tekna",
      "lowongan kerja software house",
      "lowongan kerja IT semarang",
      "lowongan kerja developer",
      position.category?.name || "",
      position.location?.name || "semarang",
      position.type?.name || "",
      position.level?.name || ""
    ].filter(Boolean).join(", ");

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
        siteName: "PT Sapujagat Nirmana Tekna",
        locale: "id_ID",
        publishedTime: position.created_at,
        modifiedTime: position.updated_at,
        authors: ["PT Sapujagat Nirmana Tekna"],
        section: "Career",
        tags: [
          position.category?.name || "",
          position.type?.name || "",
          position.level?.name || "",
          "lowongan kerja",
          "tekna career"
        ].filter(Boolean),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `/career/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for career position:", error);
    return {
      title: "Lowongan Kerja | Tekna Career",
      description: "Temukan lowongan kerja terbaru di Tekna.",
    };
  }
}
