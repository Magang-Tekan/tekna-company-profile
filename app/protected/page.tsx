import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconUsers, 
  IconFolder, 
  IconArticle, 
  IconMessageCircle,
  IconBriefcase,
  IconPhoto,
  IconWorld
} from "@tabler/icons-react";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Mock data untuk dashboard - nantinya bisa diambil dari database
  const dashboardData = {
    stats: [
      {
        title: "Total Tim",
        value: "12",
        description: "Anggota tim aktif",
        icon: IconUsers,
        change: "+2",
        changeType: "positive"
      },
      {
        title: "Proyek Aktif",
        value: "8",
        description: "Proyek sedang berjalan",
        icon: IconFolder,
        change: "+1",
        changeType: "positive"
      },
      {
        title: "Artikel Blog",
        value: "24",
        description: "Artikel diterbitkan",
        icon: IconArticle,
        change: "+3",
        changeType: "positive"
      },
      {
        title: "Testimonial",
        value: "15",
        description: "Ulasan klien",
        icon: IconMessageCircle,
        change: "+2",
        changeType: "positive"
      }
    ],
    recentProjects: [
      {
        id: "1",
        name: "Website E-commerce",
        client: "TechCorp",
        status: "completed",
        progress: 100,
        startDate: "2024-01-15",
        endDate: "2024-03-20"
      },
      {
        id: "2",
        name: "Mobile App Development",
        client: "StartupXYZ",
        status: "in-progress",
        progress: 75,
        startDate: "2024-02-01",
        endDate: "2024-05-15"
      },
      {
        id: "3",
        name: "UI/UX Redesign",
        client: "Enterprise Inc",
        status: "planning",
        progress: 25,
        startDate: "2024-04-01",
        endDate: "2024-06-30"
      }
    ],
    recentPosts: [
      {
        id: "1",
        title: "Tips Membuat Website yang Responsif",
        author: "Admin",
        status: "published",
        views: 1250,
        publishedAt: "2024-03-15"
      },
      {
        id: "2",
        title: "Teknologi Terbaru di 2024",
        author: "Admin",
        status: "published",
        views: 890,
        publishedAt: "2024-03-10"
      },
      {
        id: "3",
        title: "Cara Optimasi SEO Website",
        author: "Admin",
        status: "draft",
        views: 0,
        publishedAt: null
      }
    ]
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <div className="flex w-full">
        <AppSidebar />
        <main className="flex-1 ml-64">
          <div className="p-6 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Selamat Datang di Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Kelola website company profile Tekna Company dengan mudah dan efisien.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              {dashboardData.stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <div className="flex items-center pt-2">
                      <Badge variant={stat.changeType === "positive" ? "default" : "secondary"}>
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Projects & Posts */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Proyek Terbaru</CardTitle>
                  <CardDescription>
                    Proyek yang sedang berjalan dan baru selesai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center space-x-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            project.status === 'completed' ? 'default' : 
                            project.status === 'in-progress' ? 'secondary' : 'outline'
                          }>
                            {project.status === 'completed' ? 'Selesai' : 
                             project.status === 'in-progress' ? 'Berjalan' : 'Perencanaan'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Artikel Terbaru</CardTitle>
                  <CardDescription>
                    Artikel blog yang baru diterbitkan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center space-x-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{post.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Oleh {post.author} • {post.views} views
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                            {post.status === 'published' ? 'Diterbitkan' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>
                  Akses cepat ke fitur-fitur utama
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <a href="/protected/projects/new" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                    <IconFolder className="h-6 w-6" />
                    <span className="text-sm font-medium">Tambah Proyek</span>
                  </a>
                  <a href="/protected/blog/new" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                    <IconArticle className="h-6 w-6" />
                    <span className="text-sm font-medium">Tulis Artikel</span>
                  </a>
                  <a href="/protected/team/new" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                    <IconUsers className="h-6 w-6" />
                    <span className="text-sm font-medium">Tambah Tim</span>
                  </a>
                  <a href="/protected/services/new" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                    <IconBriefcase className="h-6 w-6" />
                    <span className="text-sm font-medium">Tambah Layanan</span>
                  </a>
                  <a href="/protected/media/upload" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                    <IconPhoto className="h-6 w-6" />
                    <span className="text-sm font-medium">Upload Media</span>
                  </a>
                  <a href="/protected/contacts" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                    <IconWorld className="h-6 w-6" />
                    <span className="text-sm font-medium">Lihat Kontak</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
