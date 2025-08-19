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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUsers, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconBrandLinkedin, IconBrandTwitter, IconBrandGithub } from "@tabler/icons-react";

export default function TeamPage() {
  // Mock data untuk tim
  const teamMembers = [
    {
      id: "1",
      firstName: "Ahmad",
      lastName: "Rizki",
      email: "ahmad.rizki@tekna.com",
      position: "CEO & Founder",
      department: "Executive",
      avatar: "/avatars/ahmad.jpg",
      linkedin: "https://linkedin.com/in/ahmad-rizki",
      twitter: "https://twitter.com/ahmadrizki",
      github: "https://github.com/ahmadrizki",
      isActive: true,
      bio: "Pemimpin visioner dengan pengalaman 15+ tahun di industri teknologi",
      expertise: "Strategic Planning, Business Development, Leadership"
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Putri",
      email: "sarah.putri@tekna.com",
      position: "CTO",
      department: "Technology",
      avatar: "/avatars/sarah.jpg",
      linkedin: "https://linkedin.com/in/sarah-putri",
      twitter: "https://twitter.com/sarahputri",
      github: "https://github.com/sarahputri",
      isActive: true,
      bio: "Ahli teknologi dengan spesialisasi dalam pengembangan software dan arsitektur sistem",
      expertise: "Software Architecture, Cloud Computing, DevOps"
    },
    {
      id: "3",
      firstName: "Budi",
      lastName: "Santoso",
      email: "budi.santoso@tekna.com",
      position: "Lead Developer",
      department: "Engineering",
      avatar: "/avatars/budi.jpg",
      linkedin: "https://linkedin.com/in/budi-santoso",
      twitter: null,
      github: "https://github.com/budisantoso",
      isActive: true,
      bio: "Developer senior dengan passion untuk kode yang bersih dan efisien",
      expertise: "Full-Stack Development, React, Node.js, Python"
    },
    {
      id: "4",
      firstName: "Diana",
      lastName: "Wati",
      email: "diana.wati@tekna.com",
      position: "UI/UX Designer",
      department: "Design",
      avatar: "/avatars/diana.jpg",
      linkedin: "https://linkedin.com/in/diana-wati",
      twitter: "https://twitter.com/dianawati",
      github: null,
      isActive: true,
      bio: "Designer kreatif yang fokus pada user experience yang luar biasa",
      expertise: "UI/UX Design, Figma, Prototyping, User Research"
    },
    {
      id: "5",
      firstName: "Eko",
      lastName: "Prasetyo",
      email: "eko.prasetyo@tekna.com",
      position: "Marketing Manager",
      department: "Marketing",
      avatar: "/avatars/eko.jpg",
      linkedin: "https://linkedin.com/in/eko-prasetyo",
      twitter: null,
      github: null,
      isActive: false,
      bio: "Marketing strategist dengan pengalaman dalam digital marketing dan brand development",
      expertise: "Digital Marketing, Brand Strategy, Content Marketing"
    }
  ];

  const getDepartmentBadge = (department: string) => {
    const colors: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      'Executive': 'default',
      'Technology': 'secondary',
      'Engineering': 'outline',
      'Design': 'destructive',
      'Marketing': 'default'
    };
    
    return <Badge variant={colors[department] || 'outline'}>{department}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default">Aktif</Badge> : 
      <Badge variant="secondary">Tidak Aktif</Badge>;
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
                  <h1 className="text-3xl font-bold tracking-tight">Kelola Tim</h1>
                  <p className="text-muted-foreground">
                    Kelola anggota tim dan informasi kontak mereka
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
                        placeholder="Cari anggota tim..."
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <IconFilter className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="w-full sm:w-auto">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Tambah Anggota
                  </Button>
                </div>
              </div>

              {/* Team Members Grid */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar} alt={`${member.firstName} ${member.lastName}`} />
                              <AvatarFallback>
                                {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{member.firstName} {member.lastName}</CardTitle>
                              <CardDescription>{member.position}</CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(member.isActive)}
                            {getDepartmentBadge(member.department)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-2">{member.bio}</p>
                            <p className="font-medium">Keahlian:</p>
                            <p className="text-sm text-muted-foreground">{member.expertise}</p>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{member.email}</span>
                          </div>
                          
                          {/* Social Links */}
                          <div className="flex items-center space-x-2 pt-2">
                            {member.linkedin && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                  <IconBrandLinkedin className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {member.twitter && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                                  <IconBrandTwitter className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {member.github && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={member.github} target="_blank" rel="noopener noreferrer">
                                  <IconBrandGithub className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
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
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tim</CardTitle>
                      <IconUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{teamMembers.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Anggota tim
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                      <Badge variant="default">{teamMembers.filter(m => m.isActive).length}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{teamMembers.filter(m => m.isActive).length}</div>
                      <p className="text-xs text-muted-foreground">
                        Anggota aktif
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Departemen</CardTitle>
                      <Badge variant="outline">{new Set(teamMembers.map(m => m.department)).size}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{new Set(teamMembers.map(m => m.department)).size}</div>
                      <p className="text-xs text-muted-foreground">
                        Jumlah departemen
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Posisi</CardTitle>
                      <Badge variant="secondary">{new Set(teamMembers.map(m => m.position)).size}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{new Set(teamMembers.map(m => m.position)).size}</div>
                      <p className="text-xs text-muted-foreground">
                        Jumlah posisi
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
