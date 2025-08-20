"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import type { ProjectStatus } from "@/lib/types/dashboard";

interface ProjectFormData {
  name: string;
  slug: string;
  client_name: string;
  project_url: string;
  github_url: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
  featured_image_url: string;
  is_featured: boolean;
}

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}

export function ProjectForm({ mode, initialData, projectId }: Readonly<ProjectFormProps>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    client_name: initialData?.client_name || '',
    project_url: initialData?.project_url || '',
    github_url: initialData?.github_url || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    status: initialData?.status || 'planning',
    featured_image_url: initialData?.featured_image_url || '',
    is_featured: initialData?.is_featured || false,
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'create') {
        await ClientDashboardService.createProject({
          name: formData.name,
          slug: formData.slug,
          client_name: formData.client_name || undefined,
          project_url: formData.project_url || undefined,
          github_url: formData.github_url || undefined,
          start_date: formData.start_date || undefined,
          end_date: formData.end_date || undefined,
          status: formData.status,
          featured_image_url: formData.featured_image_url || undefined,
          is_featured: formData.is_featured,
        });
      } else if (mode === 'edit' && projectId) {
        await ClientDashboardService.updateProject(projectId, {
          name: formData.name,
          slug: formData.slug,
          client_name: formData.client_name || undefined,
          project_url: formData.project_url || undefined,
          github_url: formData.github_url || undefined,
          start_date: formData.start_date || undefined,
          end_date: formData.end_date || undefined,
          status: formData.status,
          featured_image_url: formData.featured_image_url || undefined,
          is_featured: formData.is_featured,
        });
      }

      router.push('/dashboard/projects');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(mode === 'create' ? 'Gagal membuat proyek' : 'Gagal mengupdate proyek');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {mode === 'create' ? 'Tambah Proyek Baru' : 'Edit Proyek'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'create' 
                  ? 'Buat proyek baru untuk portofolio perusahaan'
                  : 'Perbarui informasi proyek'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Proyek</CardTitle>
                <CardDescription>
                  Lengkapi informasi proyek dengan benar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Nama Proyek */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Proyek *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Contoh: Website E-commerce Modern"
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="website-e-commerce-modern"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL slug akan dibuat otomatis dari nama proyek
                      </p>
                    </div>

                    {/* Nama Klien */}
                    <div className="space-y-2">
                      <Label htmlFor="client_name">Nama Klien</Label>
                      <Input
                        id="client_name"
                        value={formData.client_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                        placeholder="Contoh: PT Teknologi Maju"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status Proyek *</Label>
                      <Select 
                        value={formData.status} 
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ProjectStatus }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Perencanaan</SelectItem>
                          <SelectItem value="in-progress">Sedang Berjalan</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="on-hold">Ditunda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tanggal Mulai */}
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Tanggal Mulai</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>

                    {/* Tanggal Selesai */}
                    <div className="space-y-2">
                      <Label htmlFor="end_date">Tanggal Selesai</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>

                    {/* URL Proyek */}
                    <div className="space-y-2">
                      <Label htmlFor="project_url">URL Proyek</Label>
                      <Input
                        id="project_url"
                        type="url"
                        value={formData.project_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>

                    {/* GitHub URL */}
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>

                  {/* Featured Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="featured_image_url">URL Gambar Utama</Label>
                    <Input
                      id="featured_image_url"
                      type="url"
                      value={formData.featured_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Is Featured */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                    />
                    <Label htmlFor="is_featured">Jadikan proyek unggulan</Label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {mode === 'create' ? 'Buat Proyek' : 'Update Proyek'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
