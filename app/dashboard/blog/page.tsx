import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconArticle, IconPlus, IconSearch, IconFilter, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { DashboardService } from "@/lib/services/dashboard.service";

async function getBlogPosts() {
  try {
    return await DashboardService.getBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Diterbitkan</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Arsip</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const publishedCount = blogPosts.filter(post => post.status === 'published').length;
  const draftCount = blogPosts.filter(post => post.status === 'draft').length;
  const totalViews = blogPosts.reduce((total, post) => total + (post.view_count || 0), 0);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Kelola Blog</h1>
              <p className="text-muted-foreground">
                Kelola artikel blog dan konten website
              </p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari artikel..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Tulis Artikel
              </Button>
            </div>
          </div>

          {/* Blog Posts Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Artikel</CardTitle>
                <CardDescription>
                  Semua artikel blog yang telah dibuat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <IconArticle className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-medium">{post.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{post.view_count || 0} views</span>
                            {post.published_at && (
                              <>
                                <span>•</span>
                                <span>{new Date(post.published_at).toLocaleDateString('id-ID')}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(post.status)}
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <IconEye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <IconArticle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada artikel blog</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
                  <IconArticle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogPosts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Artikel yang dibuat
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diterbitkan</CardTitle>
                  <Badge variant="default">{publishedCount}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publishedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Artikel aktif
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Draft</CardTitle>
                  <Badge variant="outline">{draftCount}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{draftCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Artikel dalam draft
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <IconEye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews.toLocaleString('id-ID')}</div>
                  <p className="text-xs text-muted-foreground">
                    Total kunjungan artikel
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

