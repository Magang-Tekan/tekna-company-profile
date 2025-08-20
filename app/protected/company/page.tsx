import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconBuilding, IconEdit, IconDeviceFloppy, IconX, IconGlobe, IconMail, IconPhone, IconMapPin, IconCalendar, IconUsers, IconBriefcase } from "@tabler/icons-react";

export default function CompanyPage() {
  // Mock data untuk informasi perusahaan
  const companyInfo = {
    id: "1",
    name: "Tekna Company",
    slug: "tekna-company",
    logoUrl: "/images/logo/tekna-logo.png",
    faviconUrl: "/images/favicon/favicon.ico",
    email: "info@tekna.com",
    phone: "+62 21 1234 5678",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 12345",
    website: "https://tekna.com",
    foundedYear: 2020,
    employeeCount: 50,
    industry: "Technology & Software Development",
    isActive: true,
    description: "Tekna Company adalah perusahaan teknologi yang berfokus pada pengembangan software, website, dan aplikasi mobile. Kami membantu bisnis untuk bertransformasi digital dengan solusi teknologi yang inovatif dan berkualitas tinggi.",
    mission: "Memberikan solusi teknologi terbaik yang membantu bisnis berkembang dan berinovasi di era digital.",
    vision: "Menjadi partner teknologi terpercaya yang menggerakkan transformasi digital di Indonesia.",
    values: "Innovation, Quality, Integrity, Customer Focus, Continuous Learning",
    shortDescription: "Solusi teknologi inovatif untuk transformasi digital bisnis Anda.",
    metaTitle: "Tekna Company - Solusi Teknologi & Software Development",
    metaDescription: "Tekna Company menyediakan layanan pengembangan software, website, dan aplikasi mobile untuk membantu bisnis bertransformasi digital.",
    metaKeywords: "software development, web development, mobile app, digital transformation, technology solutions"
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Informasi Perusahaan</h1>
              <p className="text-muted-foreground">
                Kelola informasi dan profil perusahaan
              </p>
            </div>
          </div>

          {/* Company Information Form */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profil Perusahaan</CardTitle>
                    <CardDescription>
                      Informasi dasar perusahaan yang akan ditampilkan di website
                    </CardDescription>
                  </div>
                  <Button>
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Perusahaan</Label>
                      <Input id="name" value={companyInfo.name} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" value={companyInfo.slug} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2">
                        <IconMail className="h-4 w-4 text-muted-foreground" />
                        <Input id="email" value={companyInfo.email} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telepon</Label>
                      <div className="flex items-center space-x-2">
                        <IconPhone className="h-4 w-4 text-muted-foreground" />
                        <Input id="phone" value={companyInfo.phone} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="flex items-center space-x-2">
                        <IconGlobe className="h-4 w-4 text-muted-foreground" />
                        <Input id="website" value={companyInfo.website} readOnly />
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="foundedYear">Tahun Berdiri</Label>
                      <div className="flex items-center space-x-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        <Input id="foundedYear" value={companyInfo.foundedYear} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
                      <div className="flex items-center space-x-2">
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                        <Input id="employeeCount" value={companyInfo.employeeCount} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industri</Label>
                      <div className="flex items-center space-x-2">
                        <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                        <Input id="industry" value={companyInfo.industry} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant={companyInfo.isActive ? "default" : "secondary"}>
                          {companyInfo.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="address">Alamat</Label>
                  <div className="flex items-start space-x-2">
                    <IconMapPin className="h-4 w-4 text-muted-foreground mt-2" />
                    <Textarea id="address" value={companyInfo.address} readOnly className="min-h-[80px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Description */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Deskripsi & Konten</CardTitle>
                    <CardDescription>
                      Konten yang akan ditampilkan di halaman About dan halaman lainnya
                    </CardDescription>
                  </div>
                  <Button>
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
                    <Textarea id="shortDescription" value={companyInfo.shortDescription} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Lengkap</Label>
                    <Textarea id="description" value={companyInfo.description} readOnly className="min-h-[120px]" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mission">Misi</Label>
                    <Textarea id="mission" value={companyInfo.mission} readOnly className="min-h-[80px]" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vision">Visi</Label>
                    <Textarea id="vision" value={companyInfo.vision} readOnly className="min-h-[80px]" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="values">Nilai-Nilai</Label>
                    <Textarea id="values" value={companyInfo.values} readOnly className="min-h-[80px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Information */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>SEO & Meta Tags</CardTitle>
                    <CardDescription>
                      Informasi untuk optimasi search engine
                    </CardDescription>
                  </div>
                  <Button>
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" value={companyInfo.metaTitle} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea id="metaDescription" value={companyInfo.metaDescription} readOnly className="min-h-[80px]" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input id="metaKeywords" value={companyInfo.metaKeywords} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Assets */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Media & Assets</CardTitle>
                    <CardDescription>
                      Logo, favicon, dan gambar perusahaan
                    </CardDescription>
                  </div>
                  <Button>
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo Perusahaan</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconBuilding className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <Input id="logo" value={companyInfo.logoUrl} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconGlobe className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <Input id="favicon" value={companyInfo.faviconUrl} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="px-4 lg:px-6">
            <div className="flex gap-4">
              <Button className="flex-1">
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
              <Button variant="outline" className="flex-1">
                <IconX className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
