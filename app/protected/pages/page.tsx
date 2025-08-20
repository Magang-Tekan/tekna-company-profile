import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconFileDescription, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconEye, IconSettings } from "@tabler/icons-react";

export default function PagesPage() {
  // Mock data untuk halaman website
  const pages = [
    {
      id: "1",
      title: "Beranda",
      slug: "home",
      template: "home",
      status: "published",
      isHomepage: true,
      isActive: true,
      sortOrder: 1,
      createdAt: "2024-03-20 10:30:00",
      sections: ["hero", "about", "services", "team", "projects", "testimonials", "contact"]
    },
    {
      id: "2",
      title: "Tentang Kami",
      slug: "about",
      template: "about",
      status: "published",
      isHomepage: false,
      isActive: true,
      sortOrder: 2,
      createdAt: "2024-03-19 15:45:00",
      sections: ["hero", "about", "mission-vision", "values", "team", "achievements"]
    },
    {
      id: "3",
      title: "Layanan",
      slug: "services",
      template: "services",
      status: "published",
      isHomepage: false,
      isActive: true,
      sortOrder: 3,
      createdAt: "2024-03-18 09:15:00",
      sections: ["hero", "services-list", "process", "pricing", "faq"]
    },
    {
      id: "4",
      title: "Portfolio",
      slug: "portfolio",
      template: "portfolio",
      status: "published",
      isHomepage: false,
      isActive: true,
      sortOrder: 4,
      createdAt: "2024-03-17 14:20:00",
      sections: ["hero", "projects-grid", "categories", "testimonials"]
    },
    {
      id: "5",
      title: "Blog",
      slug: "blog",
      template: "blog",
      status: "published",
      isHomepage: false,
      isActive: true,
      sortOrder: 5,
      createdAt: "2024-03-16 11:30:00",
      sections: ["hero", "blog-list", "categories", "sidebar"]
    },
    {
      id: "6",
      title: "Kontak",
      slug: "contact",
      template: "contact",
      status: "published",
      isHomepage: false,
      isActive: true,
      sortOrder: 6,
      createdAt: "2024-03-15 16:45:00",
      sections: ["hero", "contact-form", "map", "info"]
    },
    {
      id: "7",
      title: "Privacy Policy",
      slug: "privacy-policy",
      template: "default",
      status: "draft",
      isHomepage: false,
      isActive: false,
      sortOrder: 7,
      createdAt: "2024-03-14 12:00:00",
      sections: ["content"]
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

  const getTemplateBadge = (template: string) => {
    const colors: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      'home': 'default',
      'about': 'secondary',
      'services': 'outline',
      'portfolio': 'destructive',
      'blog': 'default',
      'contact': 'secondary',
      'default': 'outline'
    };
    
    return <Badge variant={colors[template] || 'outline'}>{template}</Badge>;
  };

  const getHomepageBadge = (isHomepage: boolean) => {
    return isHomepage ? 
      <Badge variant="default">Homepage</Badge> : 
      <Badge variant="secondary">Page</Badge>;
  };

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default">Aktif</Badge> : 
      <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Kelola Halaman</h1>
              <p className="text-muted-foreground">
                Kelola halaman website dan konten dinamis
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
                    placeholder="Cari halaman..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Halaman
              </Button>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">
                          {page.isHomepage ? "🏠" : "📄"}
                        </div>
                        <div>
                          <CardTitle className="text-lg line-clamp-2">{page.title}</CardTitle>
                          <CardDescription className="text-sm">
                            /{page.slug}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(page.status)}
                        {getHomepageBadge(page.isHomepage)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Template:</span>
                          {getTemplateBadge(page.template)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          {getActiveBadge(page.isActive)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Urutan:</span>
                          <Badge variant="outline">#{page.sortOrder}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sections:</span>
                          <span className="font-medium">{page.sections.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tanggal:</span>
                          <span className="font-medium text-xs">{page.createdAt}</span>
                        </div>
                      </div>
                      
                      {/* Sections Preview */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Sections:</p>
                        <div className="flex flex-wrap gap-1">
                          {page.sections.slice(0, 3).map((section, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                          {page.sections.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{page.sections.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <IconEye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <IconEdit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <IconTrash className="h-4 w-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Halaman</CardTitle>
                  <IconFileDescription className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Halaman tersedia
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diterbitkan</CardTitle>
                  <Badge variant="default">{pages.filter(p => p.status === 'published').length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pages.filter(p => p.status === 'published').length}</div>
                  <p className="text-xs text-muted-foreground">
                    Halaman aktif
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Draft</CardTitle>
                  <Badge variant="outline">{pages.filter(p => p.status === 'draft').length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pages.filter(p => p.status === 'draft').length}</div>
                  <p className="text-xs text-muted-foreground">
                    Halaman draft
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Template</CardTitle>
                  <Badge variant="secondary">{new Set(pages.map(p => p.template)).size}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(pages.map(p => p.template)).size}</div>
                  <p className="text-xs text-muted-foreground">
                    Jenis template
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sections</CardTitle>
                  <IconSettings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pages.reduce((acc, page) => acc + page.sections.length, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total sections
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Page Structure Overview */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Struktur Halaman Website</CardTitle>
                <CardDescription>
                  Overview struktur dan hierarki halaman website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pages
                    .filter(p => p.isActive)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((page) => (
                      <div key={page.id} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {page.sortOrder}
                          </div>
                          <div className="w-0.5 h-8 bg-border"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{page.title}</h4>
                          <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(page.status)}
                          {getTemplateBadge(page.template)}
                          {page.isHomepage && getHomepageBadge(page.isHomepage)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
