"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* GitHub Link */}
        <Button variant="ghost" size="icon" asChild>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <span className="text-sm font-bold">GitHub</span>
          </a>
        </Button>
      </div>
    </header>
  )
}
