"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconArticle,
} from "@tabler/icons-react"

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
      title: "Proyek",
      url: "/protected/projects",
      icon: IconFolder,
    },
    {
      title: "Blog",
      url: "/protected/blog",
      icon: IconArticle,
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" {...props}>
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
