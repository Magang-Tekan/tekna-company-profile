import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconFolder, IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";

export default function ProjectsPage() {
  // Mock data untuk proyek
  const projects = [
    {
      id: "1",
      name: "Website E-commerce",
      client: "TechCorp",
      status: "completed",
      progress: 100,
      startDate: "2024-01-15",
      endDate: "2024-03-20",
      description: "Website e-commerce modern dengan fitur pembayaran online"
    },
    {
      id: "2",
      name: "Mobile App Development",
      client: "StartupXYZ",
      status: "in-progress",
      progress: 75,
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      description: "Aplikasi mobile untuk manajemen inventory"
    },
    {
      id: "3",
      name: "UI/UX Redesign",
      client: "Enterprise Inc",
      status: "planning",
      progress: 25,
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      description: "Redesign interface website perusahaan"
    },
    {
      id: "4",
      name: "API Integration",
      client: "FinTech Solutions",
      status: "in-progress",
      progress: 60,
      startDate: "2024-03-01",
      endDate: "2024-06-15",
      description: "Integrasi API untuk sistem pembayaran"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Selesai</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">Berjalan</Badge>;
      case 'planning':
        return <Badge variant="outline">Perencanaan</Badge>;
      case 'on-hold':
        return <Badge variant="destructive">Ditunda</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Kelola Proyek</h1>
              <p className="text-muted-foreground">
                Kelola semua proyek perusahaan dalam satu tempat
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
                    placeholder="Cari proyek..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Proyek
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <IconFolder className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Klien:</span>
                        <span className="font-medium">{project.client}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mulai:</span>
                        <span className="font-medium">{project.startDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Selesai:</span>
                        <span className="font-medium">{project.endDate}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
