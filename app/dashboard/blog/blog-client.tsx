'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { IconPlus, IconEdit, IconTrash, IconEye, IconEyeOff } from '@tabler/icons-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author_id: string | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
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

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await ClientDashboardService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : 'Gagal menghapus artikel');
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
    return new Date(dateString).toLocaleDateString('id-ID', {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">
            Kelola artikel dan konten blog Anda
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <IconPlus className="h-4 w-4 mr-2" />
          Tambah Artikel
        </Button>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">Belum ada artikel yang dibuat</p>
            <Button onClick={handleAddNew}>
              <IconPlus className="h-4 w-4 mr-2" />
              Buat Artikel Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader className="flex-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  {post.is_featured && (
                    <Badge variant="outline" className="flex-none">
                      Unggulan
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <IconEye className="h-4 w-4" />
                      <span>{post.view_count}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(post.status)}
                    <p className="text-xs text-muted-foreground">
                      /{post.slug}
                    </p>
                  </div>

                  {/* Content Preview */}
                  {post.content && (
                    <div className="mb-4">
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(post.id)}
                    className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
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
                    <div className="mt-2 p-3 bg-muted rounded-md text-xs">
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: truncateContent(post.content, 300) 
                        }}
                      />
                    </div>
                  )}
                    </div>
                  )}

                  {/* SEO Info */}
                  {(post.meta_title || post.meta_description || post.meta_keywords) && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md text-xs">
                      <h4 className="font-semibold text-blue-800 mb-2">SEO Info:</h4>
                      {post.meta_title && (
                        <div className="mb-1">
                          <span className="font-medium text-blue-700">Title:</span> {post.meta_title}
                        </div>
                      )}
                      {post.meta_description && (
                        <div className="mb-1">
                          <span className="font-medium text-blue-700">Description:</span> {post.meta_description}
                        </div>
                      )}
                      {post.meta_keywords && (
                        <div>
                          <span className="font-medium text-blue-700">Keywords:</span> {post.meta_keywords}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post.id)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconEdit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconTrash className="h-4 w-4 mr-1" />
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
