import { PublicService } from '@/lib/services/public.service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PublicLayout } from '@/components/layout/public-layout';

async function getPosts() {
  try {
    return await PublicService.getPublishedBlogPosts();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  const getAuthorInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Wawasan & Berita Terbaru
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Jelajahi artikel kami tentang teknologi, desain, dan inovasi yang membentuk masa depan.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.cover_image_url || 'https://via.placeholder.com/400x225'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold leading-snug group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                    <p className="mt-3 text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.team_members?.avatar_url || undefined} alt={`${post.team_members?.first_name} ${post.team_members?.last_name}`} />
                        <AvatarFallback>
                          {post.team_members ? getAuthorInitials(post.team_members.first_name, post.team_members.last_name) : 'AD'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {post.team_members ? `${post.team_members.first_name} ${post.team_members.last_name}` : 'Admin'}
                        </p>
                        <time dateTime={post.published_at ? new Date(post.published_at).toISOString() : undefined}>
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                        </time>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16">
              <h2 className="text-2xl font-semibold">Segera Hadir</h2>
              <p className="mt-2 text-muted-foreground">Belum ada artikel yang dipublikasikan. Silakan periksa kembali nanti!</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
