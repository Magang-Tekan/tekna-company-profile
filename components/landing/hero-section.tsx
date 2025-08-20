import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            Membangun Masa Depan Digital, Bersama
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Kami adalah agensi digital yang bersemangat dalam menciptakan solusi inovatif dan pengalaman pengguna yang luar biasa melalui teknologi dan desain.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/projects">Lihat Portofolio</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
