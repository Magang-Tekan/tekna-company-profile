import { PublicService } from "@/lib/services/public.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

async function getTestimonials() {
  try {
    return await PublicService.getFeaturedTestimonials();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Apa Kata Klien Kami</h2>
          <p className="mt-4 text-muted-foreground">
            Kami bangga dapat bekerja sama dengan perusahaan-perusahaan hebat.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <p className="mb-6 text-muted-foreground">&ldquo;{testimonial.testimonial_text || ''}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.client_avatar_url || undefined} />
                    <AvatarFallback>
                      {testimonial.client_name && testimonial.client_name.length > 0 
                        ? testimonial.client_name.charAt(0).toUpperCase() 
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.client_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.client_position || 'Position'}, {testimonial.client_company || 'Company'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
