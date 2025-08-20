import Link from "next/link";
import Image from "next/image";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.webp" alt="Tekna Logo" width={32} height={32} />
          <span className="text-lg font-bold">Tekna</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Fitur
          </Link>
          <Link href="/#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">
            Testimonial
          </Link>
          <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
            Kontak
          </Link>
        </nav>
      </div>
    </header>
  );
}