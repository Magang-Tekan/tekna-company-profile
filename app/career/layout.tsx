import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tekna Career - Lowongan Kerja Software House Indonesia | PT Sapujagat Nirmana Tekna",
  description:
    "Bergabunglah dengan tim Tekna! Temukan lowongan kerja terbaru di software house Indonesia terkemuka. Karir di bidang IoT, mobile app development, dan web development dengan gaji kompetitif dan lingkungan kerja yang kolaboratif di Semarang.",
  keywords: [
    "tekna career",
    "lowongan kerja tekna", 
    "karir tekna",
    "lowongan kerja software house",
    "lowongan kerja semarang",
    "lowongan kerja IT semarang",
    "lowongan kerja developer",
    "lowongan kerja IoT",
    "lowongan kerja mobile app",
    "lowongan kerja web development",
    "PT Sapujagat Nirmana Tekna career",
    "tekna.id career",
    "software house career indonesia",
    "tech jobs semarang",
    "developer jobs indonesia",
    "remote work indonesia",
    "startup jobs semarang"
  ],
  openGraph: {
    title: "Tekna Career - Lowongan Kerja Software House Indonesia",
    description:
      "Bergabunglah dengan tim Tekna! Temukan lowongan kerja terbaru di software house Indonesia terkemuka.",
    type: "website",
    siteName: "PT Sapujagat Nirmana Tekna",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tekna Career - Lowongan Kerja Software House Indonesia",
    description: "Bergabunglah dengan tim Tekna! Temukan lowongan kerja terbaru di software house Indonesia terkemuka.",
  },
  alternates: {
    canonical: "/career",
  },
};

import { PublicLayout } from "@/components/layout/public-layout";

export default function CareerLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
