"use client"

import { ThemeSwitcher } from "@/components/theme-switcher"

export function AppHeader() {
  return (
    <header className="flex items-center justify-end p-4 bg-background border-b border-border">
      <div className="flex items-center gap-2">
        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </header>
  )
}
