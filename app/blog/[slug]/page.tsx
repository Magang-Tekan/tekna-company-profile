import { PublicService } from '@/lib/services/public.service';
import { PublicLayout } from '@/components/layout/public-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ShareButton } from '@/components/ui/share-button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { IconArrowLeft, IconCalendar, IconEye } from '@tabler/icons-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await PublicService.getPublishedPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRelatedPosts(currentPostId: string, categoryId?: string) {
  try {
    return await PublicService.getRelatedPosts(currentPostId, categoryId, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Article Not Found | Tekna Solutions',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${post.title} | Tekna Solutions Blog`,
    description: post.excerpt || post.title,
    keywords: '',
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featured_image_url ? [
        {
          url: post.featured_image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: post.author_name ? [post.author_name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id);

  const getAuthorInitials = (authorName: string) => {
    if (!authorName) return 'AD';
    const names = authorName.trim().split(' ');
    const firstInitial = names[0] ? names[0].charAt(0) : '';
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Increment view count (this would be done client-side in a real app)
  // await PublicService.incrementViewCount(post.id);

  return (
    <PublicLayout>
      <article className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8 lg:mb-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-4">
                <Badge variant="secondary" className="text-sm">
                  {post.category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getAuthorInitials(post.author_name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-foreground">
                    {post.author_name || 'Admin'}
                  </p>
                  <p className="text-xs">
                    Content Writer
                  </p>
                </div>
              </div>

              <Separator orientation="vertical" className="h-6 hidden sm:block" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <IconCalendar className="h-4 w-4" />
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                </div>
                
                {post.view_count && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <IconEye className="h-4 w-4" />
                      <span>{post.view_count} views</span>
                    </div>
                  </>
                )}
              </div>

              <Separator orientation="vertical" className="h-6 hidden sm:block" />

              {/* Share Button */}
              <ShareButton 
                title={post.title}
                text={post.excerpt || ''}
                variant="ghost"
                size="sm"
                className="gap-2"
              />
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-8 lg:mb-12">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video relative rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  size="large"
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-lg prose-pre:bg-muted prose-pre:border"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Table of Contents (could be implemented with a TOC generator) */}
                
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link 
                            key={relatedPost.id} 
                            href={`/blog/${relatedPost.slug}`}
                            className="block group"
                          >
                            <div className="space-y-2">
                              {relatedPost.featured_image_url && (
                                <div className="aspect-video relative rounded-md overflow-hidden">
                                  <ImageWithFallback
                                    src={relatedPost.featured_image_url}
                                    alt={relatedPost.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                              )}
                              <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(relatedPost.published_at || relatedPost.created_at)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter Signup */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest articles and insights delivered to your inbox.
                    </p>
                    <Button className="w-full" size="sm">
                      Subscribe to Newsletter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-16 border-t">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">More Articles You Might Like</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`} 
                    className="group block"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
                      {relatedPost.featured_image_url && (
                        <div className="aspect-video relative overflow-hidden">
                          <ImageWithFallback
                            src={relatedPost.featured_image_url}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {relatedPost.excerpt}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(relatedPost.published_at || relatedPost.created_at)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}
