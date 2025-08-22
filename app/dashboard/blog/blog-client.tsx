'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { useRealtimeBlogPosts } from '@/lib/hooks/use-realtime-simple';
import { IconPlus, IconEdit, IconTrash, IconEye, IconEyeOff, IconCalendar, IconTag } from '@tabler/icons-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  featured_image_url: string | null;
  author_name: string | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  is_featured: boolean;
  is_active: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

interface BlogPageClientProps {
  readonly initialPosts: BlogPost[];
}

export function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  // Real-time sync for blog posts
  useRealtimeBlogPosts(() => {
    // Refresh posts when real-time changes are detected
    const refreshPosts = async () => {
      try {
        const updatedPosts = await ClientDashboardService.getBlogPosts();
        setPosts(updatedPosts);
      } catch (error) {
        console.error('Error refreshing posts:', error);
      }
    };
    refreshPosts();
  });

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the article "${title}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await ClientDashboardService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/dashboard/blog/edit/${postId}`);
  };

  const handleAddNew = () => {
    router.push('/dashboard/blog/new');
  };

  const toggleExpanded = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      published: { label: 'Published', variant: 'default' as const },
      archived: { label: 'Archived', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Kelola artikel dan konten blog Anda dengan mudah dan efisien
            </p>
          </div>
          <Button onClick={handleAddNew} size="lg" className="shrink-0">
            <IconPlus className="h-5 w-5 mr-2" />
            Tambah Artikel
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Artikel</p>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Diterbitkan</p>
                <p className="text-2xl font-bold text-foreground">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">
                  {posts.reduce((sum, post) => sum + (post.view_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Posts Grid */}
      {posts.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <IconPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada artikel</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Mulai dengan membuat artikel pertama Anda untuk membagikan pengetahuan dan insights
            </p>
            <Button onClick={handleAddNew} size="lg">
              <IconPlus className="h-5 w-5 mr-2" />
              Buat Artikel Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader className="flex-none pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-2 text-foreground">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  {post.is_featured && (
                    <Badge variant="outline" className="flex-none border-primary text-primary">
                      Unggulan
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Enhanced Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconEye className="h-4 w-4" />
                      <span className="font-medium">{post.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(post.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconTag className="h-3 w-3" />
                      <span>/{post.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Content Preview */}
                {post.content && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(post.id)}
                      className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-2 py-1"
                    >
                      {expandedPost === post.id ? (
                        <>
                          <IconEyeOff className="h-3 w-3 mr-1" />
                          Sembunyikan Konten
                        </>
                      ) : (
                        <>
                          <IconEye className="h-3 w-3 mr-1" />
                          Lihat Konten
                        </>
                      )}
                    </Button>
                    
                    {expandedPost === post.id && (
                      <div className="p-4 bg-muted rounded-lg text-xs border border-border">
                        <div 
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ 
                            __html: truncateContent(post.content, 300) 
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced SEO Info */}
                {(post.meta_title || post.meta_description || post.meta_keywords) && (
                  <div className="p-4 bg-secondary/30 rounded-lg text-xs border border-border">
                    <h4 className="font-semibold text-secondary-foreground mb-3 flex items-center gap-2">
                      <IconTag className="h-3 w-3" />
                      SEO Info
                    </h4>
                    <div className="space-y-2">
                      {post.meta_title && (
                        <div>
                          <span className="font-medium text-secondary-foreground">Title:</span>
                          <span className="text-muted-foreground ml-2">{post.meta_title}</span>
                        </div>
                      )}
                      {post.meta_description && (
                        <div>
                          <span className="font-medium text-secondary-foreground">Description:</span>
                          <span className="text-muted-foreground ml-2">{post.meta_description}</span>
                        </div>
                      )}
                      {post.meta_keywords && (
                        <div>
                          <span className="font-medium text-secondary-foreground">Keywords:</span>
                          <span className="text-muted-foreground ml-2">{post.meta_keywords}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Action Buttons */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post.id)}
                    disabled={isLoading}
                    className="flex-1 border-border hover:bg-muted"
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconTrash className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}