import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconCode, IconPalette, IconRocket } from "@tabler/icons-react";

const features = [
  {
    icon: <IconPalette size={40} className="text-primary" />,
    title: "Desain Kreatif",
    description: "Kami merancang antarmuka yang tidak hanya indah secara visual tetapi juga intuitif dan ramah pengguna untuk meningkatkan keterlibatan.",
  },
  {
    icon: <IconCode size={40} className="text-primary" />,
    title: "Pengembangan Modern",
    description: "Menggunakan teknologi web terbaru seperti Next.js dan Supabase untuk membangun aplikasi yang cepat, aman, dan dapat diskalakan.",
  },
  {
    icon: <IconRocket size={40} className="text-primary" />,
    title: "Strategi Digital",
    description: "Dari SEO hingga manajemen konten, kami membantu Anda membangun kehadiran online yang kuat dan mencapai target audiens Anda.",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Apa yang Kami Tawarkan</h2>
          <p className="mt-4 text-muted-foreground">
            Solusi lengkap untuk membantu bisnis Anda bertumbuh di era digital.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <CardHeader className="items-center">
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
