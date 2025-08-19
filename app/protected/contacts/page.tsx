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
import { IconWorld, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconMail, IconPhone, IconBuilding, IconEye } from "@tabler/icons-react";

export default function ContactsPage() {
  // Mock data untuk kontak dan inquiry
  const contacts = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+62 812-3456-7890",
      company: "TechCorp Indonesia",
      subject: "Website Development Inquiry",
      message: "Saya tertarik dengan layanan web development yang ditawarkan. Bisa minta informasi lebih detail tentang paket dan harga?",
      status: "new",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      createdAt: "2024-03-20 10:30:00"
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah.wilson@startup.com",
      phone: "+62 811-2345-6789",
      company: "StartupXYZ",
      subject: "Mobile App Development",
      message: "Kami sedang mencari partner untuk mengembangkan aplikasi mobile. Apakah bisa diskusi lebih lanjut?",
      status: "read",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      createdAt: "2024-03-19 15:45:00"
    },
    {
      id: "3",
      name: "Ahmad Rizki",
      email: "ahmad.rizki@enterprise.com",
      phone: "+62 813-4567-8901",
      company: "Enterprise Inc",
      subject: "UI/UX Design Services",
      message: "Perusahaan kami membutuhkan redesign website. Bisa minta portfolio dan contoh project sebelumnya?",
      status: "replied",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      createdAt: "2024-03-18 09:15:00"
    },
    {
      id: "4",
      name: "Diana Wati",
      email: "diana.wati@agency.com",
      phone: "+62 814-5678-9012",
      company: "Digital Agency",
      subject: "Partnership Opportunity",
      message: "Kami ingin menjalin kerjasama dalam project digital. Apakah ada kesempatan untuk meeting?",
      status: "closed",
      ipAddress: "192.168.1.103",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      createdAt: "2024-03-17 14:20:00"
    },
    {
      id: "5",
      name: "Budi Santoso",
      email: "budi.santoso@consulting.com",
      phone: "+62 815-6789-0123",
      company: "IT Consulting",
      subject: "Cloud Solutions",
      message: "Kami membutuhkan solusi cloud untuk infrastruktur IT. Bisa minta proposal dan demo?",
      status: "new",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      createdAt: "2024-03-16 11:30:00"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">Baru</Badge>;
      case 'read':
        return <Badge variant="secondary">Sudah Dibaca</Badge>;
      case 'replied':
        return <Badge variant="outline">Sudah Dibalas</Badge>;
      case 'closed':
        return <Badge variant="destructive">Ditutup</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
                  <h1 className="text-3xl font-bold tracking-tight">Kelola Kontak</h1>
                  <p className="text-muted-foreground">
                    Kelola inquiry dan pesan dari pengunjung website
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
                        placeholder="Cari kontak..."
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <IconFilter className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="w-full sm:w-auto">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Tambah Kontak
                  </Button>
                </div>
              </div>

              {/* Contacts List */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daftar Kontak & Inquiry</CardTitle>
                    <CardDescription>
                      Semua pesan dan inquiry dari pengunjung website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <IconMail className="h-4 w-4 text-muted-foreground" />
                                  <h3 className="font-medium">{contact.name}</h3>
                                </div>
                                {getStatusBadge(contact.status)}
                              </div>
                              <span className="text-xs text-muted-foreground">{contact.createdAt}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <IconMail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{contact.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <IconPhone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{contact.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <IconBuilding className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Company:</span>
                                <span className="font-medium">{contact.company}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <IconWorld className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">IP:</span>
                                <span className="font-mono text-xs">{contact.ipAddress}</span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                              <p className="text-sm font-medium">{contact.subject}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Message:</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm">
                                <IconEye className="h-4 w-4 mr-2" />
                                Lihat Detail
                              </Button>
                              <Button variant="outline" size="sm">
                                <IconEdit className="h-4 w-4 mr-2" />
                                Edit Status
                              </Button>
                              <Button variant="outline" size="sm">
                                <IconTrash className="h-4 w-4 mr-2" />
                                Hapus
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Cards */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-4 md:grid-cols-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Kontak</CardTitle>
                      <IconWorld className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contacts.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Semua inquiry
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Baru</CardTitle>
                      <Badge variant="default">{contacts.filter(c => c.status === 'new').length}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'new').length}</div>
                      <p className="text-xs text-muted-foreground">
                        Belum dibaca
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sudah Dibaca</CardTitle>
                      <Badge variant="secondary">{contacts.filter(c => c.status === 'read').length}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'read').length}</div>
                      <p className="text-xs text-muted-foreground">
                        Sudah dibaca
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sudah Dibalas</CardTitle>
                      <Badge variant="outline">{contacts.filter(c => c.status === 'replied').length}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'replied').length}</div>
                      <p className="text-xs text-muted-foreground">
                        Sudah dibalas
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Ditutup</CardTitle>
                      <Badge variant="destructive">{contacts.filter(c => c.status === 'closed').length}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'closed').length}</div>
                      <p className="text-xs text-muted-foreground">
                        Sudah ditutup
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
