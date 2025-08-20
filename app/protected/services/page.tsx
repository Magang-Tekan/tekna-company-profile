import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconBriefcase, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconEye } from "@tabler/icons-react";

export default function ServicesPage() {
  // Mock data untuk layanan
  const services = [
    {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      icon: "🌐",
      imageUrl: "/images/services/web-development.jpg",
      isActive: true,
      sortOrder: 1,
      description: "Pengembangan website modern dan responsif dengan teknologi terbaru",
      shortDescription: "Website profesional yang responsif dan SEO-friendly",
      features: "Responsive Design, SEO Optimization, CMS Integration, Performance Optimization",
      benefits: "Meningkatkan brand awareness, Lead generation, Customer engagement"
    },
    {
      id: "2",
      name: "Mobile App Development",
      slug: "mobile-app-development",
      icon: "📱",
      imageUrl: "/images/services/mobile-app.jpg",
      isActive: true,
      sortOrder: 2,
      description: "Pengembangan aplikasi mobile native dan cross-platform untuk iOS dan Android",
      shortDescription: "Aplikasi mobile yang user-friendly dan performant",
      features: "Native Development, Cross-platform, UI/UX Design, App Store Optimization",
      benefits: "Mobile-first approach, Better user experience, Increased accessibility"
    },
    {
      id: "3",
      name: "UI/UX Design",
      slug: "ui-ux-design",
      icon: "🎨",
      imageUrl: "/images/services/ui-ux-design.jpg",
      isActive: true,
      sortOrder: 3,
      description: "Desain antarmuka dan pengalaman pengguna yang intuitif dan menarik",
      shortDescription: "Desain yang fokus pada user experience",
      features: "User Research, Wireframing, Prototyping, Usability Testing",
      benefits: "Improved user satisfaction, Higher conversion rates, Better brand perception"
    },
    {
      id: "4",
      name: "Cloud Solutions",
      slug: "cloud-solutions",
      icon: "☁️",
      imageUrl: "/images/services/cloud-solutions.jpg",
      isActive: true,
      sortOrder: 4,
      description: "Solusi cloud computing untuk skalabilitas dan efisiensi bisnis",
      shortDescription: "Infrastruktur cloud yang scalable dan reliable",
      features: "AWS/Azure/GCP, Serverless Architecture, Auto-scaling, Security",
      benefits: "Cost efficiency, Scalability, Reliability, Security"
    },
    {
      id: "5",
      name: "Digital Marketing",
      slug: "digital-marketing",
      icon: "📈",
      imageUrl: "/images/services/digital-marketing.jpg",
      isActive: false,
      sortOrder: 5,
      description: "Strategi pemasaran digital untuk meningkatkan visibility dan conversion",
      shortDescription: "Strategi marketing yang data-driven",
      features: "SEO, SEM, Social Media, Content Marketing, Analytics",
      benefits: "Increased visibility, Higher ROI, Better targeting, Measurable results"
    }
  ];

  const getStatusBadge = (isActive: boolean) => {
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
              <h1 className="text-3xl font-bold tracking-tight">Kelola Layanan</h1>
              <p className="text-muted-foreground">
                Kelola layanan dan produk yang ditawarkan perusahaan
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
                    placeholder="Cari layanan..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Layanan
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{service.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {service.shortDescription}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(service.isActive)}
                        <Badge variant="outline">#{service.sortOrder}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-2">{service.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fitur Utama:</p>
                          <p className="text-xs text-muted-foreground">{service.features}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Manfaat:</p>
                          <p className="text-xs text-muted-foreground">{service.benefits}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Slug:</span>
                        <span className="font-mono text-xs">{service.slug}</span>
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
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Layanan</CardTitle>
                  <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Layanan tersedia
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                  <Badge variant="default">{services.filter(s => s.isActive).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.filter(s => s.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Layanan aktif
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tidak Aktif</CardTitle>
                  <Badge variant="secondary">{services.filter(s => !s.isActive).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.filter(s => !s.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Layanan non-aktif
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                  <Badge variant="outline">{new Set(services.map(s => s.name.split(' ')[0])).size}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(services.map(s => s.name.split(' ')[0])).size}</div>
                  <p className="text-xs text-muted-foreground">
                    Jenis layanan
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
