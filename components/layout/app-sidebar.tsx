"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClientOnly } from "@/components/ui/client-only"
import Image from "next/image";
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Settings, 
  HelpCircle, 
  Search,
  Plus
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/protected",
    icon: LayoutDashboard,
  },
  {
    title: "Proyek",
    href: "/protected/projects",
    icon: FolderOpen,
  },
  {
    title: "Blog",
    href: "/protected/blog",
    icon: FileText,
  },
]

const bottomNavigationItems = [
  {
    title: "Pengaturan",
    href: "/protected/settings",
    icon: Settings,
  },
  {
    title: "Bantuan",
    href: "/protected/help",
    icon: HelpCircle,
  },
  {
    title: "Pencarian",
    href: "/protected/search",
    icon: Search,
  },
]

export function AppSidebarNew() {
  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center p-3 border-b border-sidebar-border">
        <Link href="/protected" className="flex items-center justify-center">
          <Image 
            src="/logo.webp" 
            alt="Tekna Company Logo" 
            width={100} 
            height={25} 
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Quick Create Button */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Quick Create
        </Button>
      </div>

      {/* Main Navigation */}
      <ClientOnly>
        <NavigationItems />
      </ClientOnly>

      {/* Bottom Navigation */}
      <ClientOnly>
        <BottomNavigationItems />
      </ClientOnly>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Admin
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              admin@tekna.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavigationItems() {
  const pathname = usePathname()
  
  return (
    <nav className="flex-1 px-4 space-y-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

function BottomNavigationItems() {
  const pathname = usePathname()
  
  return (
    <div className="p-4 space-y-1 border-t border-sidebar-border">
      {bottomNavigationItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}
