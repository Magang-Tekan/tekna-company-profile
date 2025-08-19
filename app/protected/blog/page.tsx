import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconArticle, IconPlus, IconSearch, IconFilter, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

export default function BlogPage() {
  // Mock data untuk blog posts
  const blogPosts = [
    {
      id: "1",
      title: "Tips Membuat Website yang Responsif",
      excerpt: "Panduan lengkap untuk membuat website yang responsif dan user-friendly di berbagai perangkat...",
      author: "Admin",
      status: "published",
      views: 1250,
      publishedAt: "2024-03-15",
      category: "Web Development",
      tags: ["Responsive", "CSS", "UX"]
    },
    {
      id: "2",
      title: "Teknologi Terbaru di 2024",
      excerpt: "Eksplorasi teknologi-teknologi terbaru yang akan mendominasi industri IT di tahun 2024...",
      author: "Admin",
      status: "published",
      views: 890,
      publishedAt: "2024-03-10",
      category: "Technology",
      tags: ["AI", "Machine Learning", "2024"]
    },
    {
      id: "3",
      title: "Cara Optimasi SEO Website",
      excerpt: "Strategi dan teknik untuk mengoptimalkan SEO website agar mendapatkan ranking tinggi di Google...",
      author: "Admin",
      status: "draft",
      views: 0,
      publishedAt: null,
      category: "SEO",
      tags: ["SEO", "Google", "Optimization"]
    },
    {
      id: "4",
      title: "Peran AI dalam Pengembangan Software",
      excerpt: "Bagaimana Artificial Intelligence mengubah cara kita mengembangkan software dan aplikasi...",
      author: "Admin",
      status: "published",
      views: 1560,
      publishedAt: "2024-03-05",
      category: "AI",
      tags: ["AI", "Software", "Development"]
    },
    {
      id: "5",
      title: "Best Practices untuk Mobile App",
      excerpt: "Praktik terbaik dalam pengembangan aplikasi mobile yang user-friendly dan performant...",
      author: "Admin",
      status: "published",
      views: 720,
      publishedAt: "2024-02-28",
      category: "Mobile",
      tags: ["Mobile", "App", "Best Practices"]
    }
  ];

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

  const getCategoryBadge = (category: string) => {
    return <Badge variant="outline" className="text-xs">{category}</Badge>;
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
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
                      {blogPosts.map((post) => (
                        <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <IconArticle className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-medium">{post.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>Oleh {post.author}</span>
                              <span>•</span>
                              <span>{post.views} views</span>
                              {post.publishedAt && (
                                <>
                                  <span>•</span>
                                  <span>{post.publishedAt}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 pt-1">
                              {getCategoryBadge(post.category)}
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
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
                      ))}
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
                      <Badge variant="default">4</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-xs text-muted-foreground">
                        Artikel aktif
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Draft</CardTitle>
                      <Badge variant="outline">1</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1</div>
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
                      <div className="text-2xl font-bold">4,420</div>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
