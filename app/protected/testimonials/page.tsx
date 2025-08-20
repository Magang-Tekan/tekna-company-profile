import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconMessageCircle, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconStar, IconBuilding, IconUser } from "@tabler/icons-react";

export default function TestimonialsPage() {
  // Mock data untuk testimonial
  const testimonials = [
    {
      id: "1",
      clientName: "John Doe",
      clientPosition: "CEO",
      clientCompany: "TechCorp Indonesia",
      clientAvatarUrl: "/avatars/john-doe.jpg",
      rating: 5,
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      content: "Tekna Company telah membantu kami mengembangkan website e-commerce yang luar biasa. Tim mereka sangat profesional dan hasilnya melebihi ekspektasi kami. Website kami sekarang memiliki performa yang sangat baik dan user experience yang memuaskan.",
      createdAt: "2024-03-20 10:30:00"
    },
    {
      id: "2",
      clientName: "Sarah Wilson",
      clientPosition: "Marketing Director",
      clientCompany: "StartupXYZ",
      clientAvatarUrl: "/avatars/sarah-wilson.jpg",
      rating: 5,
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      content: "Kami sangat puas dengan layanan mobile app development dari Tekna Company. Aplikasi yang mereka buat sangat user-friendly dan memiliki fitur yang lengkap. Proses development berjalan lancar dan komunikasi tim sangat baik.",
      createdAt: "2024-03-19 15:45:00"
    },
    {
      id: "3",
      clientName: "Ahmad Rizki",
      clientPosition: "IT Manager",
      clientCompany: "Enterprise Inc",
      clientAvatarUrl: "/avatars/ahmad-rizki.jpg",
      rating: 4,
      isActive: true,
      isFeatured: false,
      sortOrder: 3,
      content: "Tekna Company membantu kami melakukan redesign website perusahaan. Hasilnya sangat memuaskan dengan peningkatan signifikan pada conversion rate dan user engagement. Tim mereka sangat memahami kebutuhan bisnis kami.",
      createdAt: "2024-03-18 09:15:00"
    },
    {
      id: "4",
      clientName: "Diana Wati",
      clientPosition: "Founder",
      clientCompany: "Digital Agency",
      clientAvatarUrl: "/avatars/diana-wati.jpg",
      rating: 5,
      isActive: true,
      isFeatured: true,
      sortOrder: 4,
      content: "Kami telah bekerjasama dengan Tekna Company dalam beberapa project. Kualitas kerja mereka selalu konsisten dan hasilnya selalu memuaskan. Mereka adalah partner teknologi yang sangat terpercaya.",
      createdAt: "2024-03-17 14:20:00"
    },
    {
      id: "5",
      clientName: "Budi Santoso",
      clientPosition: "CTO",
      clientCompany: "IT Consulting",
      clientAvatarUrl: "/avatars/budi-santoso.jpg",
      rating: 4,
      isActive: false,
      isFeatured: false,
      sortOrder: 5,
      content: "Tekna Company memberikan solusi cloud yang sangat baik untuk infrastruktur IT kami. Implementasi berjalan lancar dan performa sistem meningkat signifikan. Support pasca implementasi juga sangat responsif.",
      createdAt: "2024-03-16 11:30:00"
    }
  ];

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <IconStar
            key={index}
            className={`h-4 w-4 ${
              index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">({rating}/5)</span>
      </div>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default">Aktif</Badge> : 
      <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  const getFeaturedBadge = (isFeatured: boolean) => {
    return isFeatured ? 
      <Badge variant="outline">Featured</Badge> : 
      <Badge variant="secondary">Regular</Badge>;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Kelola Testimonial</h1>
              <p className="text-muted-foreground">
                Kelola testimonial dan review dari klien
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
                    placeholder="Cari testimonial..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Testimonial
              </Button>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.clientAvatarUrl} alt={testimonial.clientName} />
                          <AvatarFallback>
                            <IconUser className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{testimonial.clientName}</CardTitle>
                          <CardDescription className="text-sm">
                            {testimonial.clientPosition} at {testimonial.clientCompany}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(testimonial.isActive)}
                        {getFeaturedBadge(testimonial.isFeatured)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        {getRatingStars(testimonial.rating)}
                        <Badge variant="outline">#{testimonial.sortOrder}</Badge>
                      </div>
                      
                      {/* Content */}
                      <div className="text-sm">
                        <p className="text-muted-foreground line-clamp-4">{testimonial.content}</p>
                      </div>
                      
                      {/* Company Info */}
                      <div className="flex items-center space-x-2 text-sm">
                        <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Company:</span>
                        <span className="font-medium">{testimonial.clientCompany}</span>
                      </div>
                      
                      {/* Date */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tanggal:</span>
                        <span className="font-medium text-xs">{testimonial.createdAt}</span>
                      </div>
                      
                      {/* Actions */}
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
                  <CardTitle className="text-sm font-medium">Total Testimonial</CardTitle>
                  <IconMessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testimonials.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Testimonial tersedia
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                  <Badge variant="default">{testimonials.filter(t => t.isActive).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testimonials.filter(t => t.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Testimonial aktif
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured</CardTitle>
                  <Badge variant="outline">{testimonials.filter(t => t.isFeatured).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testimonials.filter(t => t.isFeatured).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Testimonial unggulan
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating 5</CardTitle>
                  <Badge variant="default">{testimonials.filter(t => t.rating === 5).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testimonials.filter(t => t.rating === 5).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Rating sempurna
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
                  <IconStar className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rating rata-rata
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
