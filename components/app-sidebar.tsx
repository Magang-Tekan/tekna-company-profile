"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconArticle,
  IconBriefcase,
  IconBuilding,
  IconMessageCircle,
  IconAward,
  IconPhoto,
  IconWorld,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@tekna.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/protected",
      icon: IconDashboard,
    },
    {
      title: "Perusahaan",
      url: "/protected/company",
      icon: IconBuilding,
    },
    {
      title: "Tim",
      url: "/protected/team",
      icon: IconUsers,
    },
    {
      title: "Layanan",
      url: "/protected/services",
      icon: IconBriefcase,
    },
    {
      title: "Proyek",
      url: "/protected/projects",
      icon: IconFolder,
    },
    {
      title: "Blog",
      url: "/protected/blog",
      icon: IconArticle,
    },
    {
      title: "Testimonial",
      url: "/protected/testimonials",
      icon: IconMessageCircle,
    },
    {
      title: "Pencapaian",
      url: "/protected/achievements",
      icon: IconAward,
    },
    {
      title: "Halaman",
      url: "/protected/pages",
      icon: IconFileDescription,
    },
    {
      title: "Media",
      url: "/protected/media",
      icon: IconPhoto,
    },
    {
      title: "Kontak",
      url: "/protected/contacts",
      icon: IconWorld,
    },
  ],
  navClouds: [
    {
      title: "Konten",
      icon: IconFileDescription,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Draft",
          url: "/protected/drafts",
        },
        {
          title: "Diterbitkan",
          url: "/protected/published",
        },
        {
          title: "Arsip",
          url: "/protected/archived",
        },
      ],
    },
    {
      title: "Analitik",
      icon: IconChartBar,
      url: "#",
      items: [
        {
          title: "Statistik Blog",
          url: "/protected/analytics/blog",
        },
        {
          title: "Statistik Proyek",
          url: "/protected/analytics/projects",
        },
        {
          title: "Kunjungan Website",
          url: "/protected/analytics/visits",
        },
      ],
    },
    {
      title: "Pengaturan",
      icon: IconSettings,
      url: "#",
      items: [
        {
          title: "Bahasa",
          url: "/protected/settings/languages",
        },
        {
          title: "SEO",
          url: "/protected/settings/seo",
        },
        {
          title: "Integrasi",
          url: "/protected/settings/integrations",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "/protected/settings",
      icon: IconSettings,
    },
    {
      title: "Bantuan",
      url: "/protected/help",
      icon: IconHelp,
    },
    {
      title: "Pencarian",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Database",
      url: "/protected/database",
      icon: IconDatabase,
    },
    {
      name: "Laporan",
      url: "/protected/reports",
      icon: IconReport,
    },
    {
      name: "Backup",
      url: "/protected/backup",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/protected">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Tekna Company</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
