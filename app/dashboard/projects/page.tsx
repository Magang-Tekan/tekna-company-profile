import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconFolder, IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";
import { DashboardService } from "@/lib/services/dashboard.service";

async function getProjects() {
  try {
    return await DashboardService.getProjects();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

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
            {projects.length > 0 ? (
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
                      {project.client_name && (
                        <CardDescription>
                          Klien: {project.client_name}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {project.start_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mulai:</span>
                            <span className="font-medium">
                              {new Date(project.start_date).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}
                        {project.end_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Selesai:</span>
                            <span className="font-medium">
                              {new Date(project.end_date).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}
                        
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
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <IconFolder className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada proyek</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Mulai dengan menambahkan proyek pertama Anda
                  </p>
                  <Button>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Tambah Proyek
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
