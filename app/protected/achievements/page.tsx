import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconAward, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconTrophy } from "@tabler/icons-react";

export default function AchievementsPage() {
  // Mock data untuk pencapaian
const achievements = [
    {
      id: "1",
      title: "Best Technology Company 2024",
      year: 2024,
      imageUrl: "/images/achievements/best-tech-company-2024.jpg",
      isActive: true,
      sortOrder: 1,
      description: "Penghargaan sebagai perusahaan teknologi terbaik di Indonesia tahun 2024 dari Indonesian Technology Awards",
      category: "Industry Recognition",
      organization: "Indonesian Technology Awards",
      location: "Jakarta, Indonesia"
    },
    {
      id: "2",
      title: "Excellence in Web Development",
      year: 2023,
      imageUrl: "/images/achievements/web-dev-excellence-2023.jpg",
      isActive: true,
      sortOrder: 2,
      description: "Penghargaan keunggulan dalam pengembangan website dari Web Development Association",
      category: "Technical Excellence",
      organization: "Web Development Association",
      location: "Bandung, Indonesia"
    },
    {
      id: "3",
      title: "Innovation Award for Mobile Apps",
      year: 2023,
      imageUrl: "/images/achievements/mobile-innovation-2023.jpg",
      isActive: true,
      sortOrder: 3,
      description: "Penghargaan inovasi untuk pengembangan aplikasi mobile yang user-friendly dan inovatif",
      category: "Innovation",
      organization: "Mobile App Innovation Forum",
      location: "Surabaya, Indonesia"
    },
    {
      id: "4",
      title: "Customer Satisfaction Award",
      year: 2022,
      imageUrl: "/images/achievements/customer-satisfaction-2022.jpg",
      isActive: true,
      sortOrder: 4,
      description: "Penghargaan kepuasan pelanggan tertinggi berdasarkan survey dan feedback klien",
      category: "Customer Service",
      organization: "Customer Experience Institute",
      location: "Yogyakarta, Indonesia"
    },
    {
      id: "5",
      title: "Startup of the Year",
      year: 2022,
      imageUrl: "/images/achievements/startup-year-2022.jpg",
      isActive: false,
      sortOrder: 5,
      description: "Penghargaan startup terbaik tahun 2022 dari Indonesian Startup Association",
      category: "Business Achievement",
      organization: "Indonesian Startup Association",
      location: "Medan, Indonesia"
    }
  ];

  const getCategoryBadge = (category: string) => {
    const colors: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      'Industry Recognition': 'default',
      'Technical Excellence': 'secondary',
      'Innovation': 'outline',
      'Customer Service': 'destructive',
      'Business Achievement': 'default'
    };
    
    return <Badge variant={colors[category] || 'outline'}>{category}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default">Aktif</Badge> : 
      <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  const getYearBadge = (year: number) => {
    return <Badge variant="outline">{year}</Badge>;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Kelola Pencapaian</h1>
              <p className="text-muted-foreground">
                Kelola penghargaan, sertifikasi, dan pencapaian perusahaan
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
                    placeholder="Cari pencapaian..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Pencapaian
              </Button>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">🏆</div>
                        <div>
                          <CardTitle className="text-lg line-clamp-2">{achievement.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {achievement.organization}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(achievement.isActive)}
                        {getYearBadge(achievement.year)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground line-clamp-3">{achievement.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Kategori:</span>
                          {getCategoryBadge(achievement.category)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Organisasi:</span>
                          <span className="font-medium">{achievement.organization}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Lokasi:</span>
                          <span className="font-medium">{achievement.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Urutan:</span>
                          <Badge variant="outline">#{achievement.sortOrder}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
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
                  <CardTitle className="text-sm font-medium">Total Pencapaian</CardTitle>
                  <IconAward className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{achievements.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Pencapaian tersedia
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                  <Badge variant="default">{achievements.filter(a => a.isActive).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{achievements.filter(a => a.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Pencapaian aktif
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tahun 2024</CardTitle>
                  <Badge variant="outline">{achievements.filter(a => a.year === 2024).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{achievements.filter(a => a.year === 2024).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Pencapaian 2024
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                  <Badge variant="secondary">{new Set(achievements.map(a => a.category)).size}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(achievements.map(a => a.category)).size}</div>
                  <p className="text-xs text-muted-foreground">
                    Jenis kategori
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organisasi</CardTitle>
                  <IconTrophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(achievements.map(a => a.organization)).size}</div>
                  <p className="text-xs text-muted-foreground">
                    Jumlah organisasi
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievement Timeline */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Pencapaian</CardTitle>
                <CardDescription>
                  Perjalanan pencapaian perusahaan dari tahun ke tahun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements
                    .filter(a => a.isActive)
                    .sort((a, b) => b.year - a.year)
                    .map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {achievement.year}
                          </div>
                          {index < achievements.filter(a => a.isActive).length - 1 && (
                            <div className="w-0.5 h-8 bg-border"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.organization}</p>
                        </div>
                        {getCategoryBadge(achievement.category)}
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
