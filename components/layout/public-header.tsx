"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Menu,
  X,
  Rocket,
  Code,
  Globe,
  Users,
  Briefcase,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useNavbarAnimation } from "@/hooks/use-navbar-animation";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Use navbar animation hook
  const { navbarRef, logoRef, navRef, themeSwitcherRef } = useNavbarAnimation({
    onFloatingStart: () => {
      // Navbar started floating
    },
    onFloatingEnd: () => {
      // Navbar returned to normal
    },
  });

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{
        height: "5rem", // 80px - normal height
        width: "100%", // Full width
        backgroundColor: "rgba(var(--background), 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(var(--border), 0.2)",
        margin: "0",
        padding: "0",
        borderRadius: "0",
      }}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group" ref={logoRef}>
          <div className="relative">
            <Image
              src="/logo.webp"
              alt="Tekna Logo"
              width={40}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center gap-8 text-sm font-medium"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 group ${
              pathname === "/"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Go to homepage"
          >
            <Code className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Beranda
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 group ${
              pathname === "/about"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Learn about our company"
          >
            <Users className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Tentang Kami
          </Link>
          <Link
            href="/projects"
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 group ${
              pathname === "/projects"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="View our projects portfolio"
          >
            <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Proyek
          </Link>
          <Link
            href="/products"
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 group ${
              pathname === "/products"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Explore our products"
          >
            <Package className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Product
          </Link>
          <Link
            href="/blog"
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 group ${
              pathname === "/blog"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Read our blog articles"
          >
            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Blog
          </Link>
          <Link
            href="/career"
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 group ${
              pathname.startsWith("/career")
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="View career opportunities"
          >
            <Briefcase className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Career
          </Link>
        </nav>

        {/* Right Section - Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div ref={themeSwitcherRef}>
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-4" aria-label="Mobile navigation">
              <Link
                href="/"
                className={`flex items-center gap-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted/50 ${
                  pathname === "/"
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Go to homepage"
              >
                <Code className="w-4 h-4" />
                Beranda
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted/50 ${
                  pathname === "/about"
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Learn about our company"
              >
                <Users className="w-4 h-4" />
                Tentang Kami
              </Link>
              <Link
                href="/projects"
                className={`flex items-center gap-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted/50 ${
                  pathname === "/projects"
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="View our projects portfolio"
              >
                <Rocket className="w-4 h-4" />
                Proyek
              </Link>
              <Link
                href="/products"
                className={`flex items-center gap-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted/50 ${
                  pathname === "/products"
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Explore our products"
              >
                <Package className="w-4 h-4" />
                Product
              </Link>
              <Link
                href="/blog"
                className={`flex items-center gap-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted/50 ${
                  pathname === "/blog"
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Read our blog articles"
              >
                <Globe className="w-4 h-4" />
                Blog
              </Link>
              <Link
                href="/career"
                className={`flex items-center gap-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted/50 ${
                  pathname.startsWith("/career")
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="View career opportunities"
              >
                <Briefcase className="w-4 h-4" />
                Career
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
