import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPhoto, IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconDownload, IconEye, IconFolder, IconFile, IconVideo, IconFileText } from "@tabler/icons-react";

export default function MediaPage() {
  // Mock data untuk media files
  const mediaFiles = [
    {
      id: "1",
      filename: "company-logo.png",
      originalFilename: "tekna-logo-2024.png",
      filePath: "/uploads/logo/company-logo.png",
      fileUrl: "https://tekna.com/uploads/logo/company-logo.png",
      fileSize: 245760, // 240KB
      mimeType: "image/png",
      width: 800,
      height: 400,
      altText: "Tekna Company Logo",
      caption: "Logo resmi Tekna Company tahun 2024",
      uploadedBy: "Admin",
      isActive: true,
      createdAt: "2024-03-20 10:30:00"
    },
    {
      id: "2",
      filename: "hero-image.jpg",
      originalFilename: "hero-banner-2024.jpg",
      filePath: "/uploads/hero/hero-image.jpg",
      fileUrl: "https://tekna.com/uploads/hero/hero-image.jpg",
      fileSize: 1048576, // 1MB
      mimeType: "image/jpeg",
      width: 1920,
      height: 1080,
      altText: "Hero Banner Image",
      caption: "Banner utama website dengan tema teknologi",
      uploadedBy: "Admin",
      isActive: true,
      createdAt: "2024-03-19 15:45:00"
    },
    {
      id: "3",
      filename: "team-photo.jpg",
      originalFilename: "team-photo-2024.jpg",
      filePath: "/uploads/team/team-photo.jpg",
      fileUrl: "https://tekna.com/uploads/team/team-photo.jpg",
      fileSize: 2097152, // 2MB
      mimeType: "image/jpeg",
      width: 1600,
      height: 900,
      altText: "Team Photo",
      caption: "Foto tim Tekna Company",
      uploadedBy: "Admin",
      isActive: true,
      createdAt: "2024-03-18 09:15:00"
    },
    {
      id: "4",
      filename: "project-demo.mp4",
      originalFilename: "project-demo-video.mp4",
      filePath: "/uploads/videos/project-demo.mp4",
      fileUrl: "https://tekna.com/uploads/videos/project-demo.mp4",
      fileSize: 52428800, // 50MB
      mimeType: "video/mp4",
      width: 1920,
      height: 1080,
      altText: "Project Demo Video",
      caption: "Video demo project website e-commerce",
      uploadedBy: "Admin",
      isActive: true,
      createdAt: "2024-03-17 14:20:00"
    },
    {
      id: "5",
      filename: "company-profile.pdf",
      originalFilename: "tekna-company-profile-2024.pdf",
      filePath: "/uploads/documents/company-profile.pdf",
      fileUrl: "https://tekna.com/uploads/documents/company-profile.pdf",
      fileSize: 2097152, // 2MB
      mimeType: "application/pdf",
      width: null,
      height: null,
      altText: "Company Profile PDF",
      caption: "Dokumen profil perusahaan dalam format PDF",
      uploadedBy: "Admin",
      isActive: false,
      createdAt: "2024-03-16 11:30:00"
    }
  ];

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <IconPhoto className="h-8 w-8 text-blue-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <IconVideo className="h-8 w-8 text-red-500" />;
    } else if (mimeType === 'application/pdf') {
      return <IconFileText className="h-8 w-8 text-red-600" />;
    } else {
      return <IconFile className="h-8 w-8 text-gray-500" />;
    }
  };

  const getFileTypeBadge = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Badge variant="default">Image</Badge>;
    } else if (mimeType.startsWith('video/')) {
      return <Badge variant="secondary">Video</Badge>;
    } else if (mimeType === 'application/pdf') {
      return <Badge variant="destructive">PDF</Badge>;
    } else {
      return <Badge variant="outline">File</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default">Aktif</Badge> : 
      <Badge variant="secondary">Tidak Aktif</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDimensions = (width: number | null, height: number | null) => {
    if (width && height) {
      return `${width} × ${height}`;
    }
    return 'N/A';
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Kelola Media</h1>
              <p className="text-muted-foreground">
                Kelola file media, gambar, dan dokumen perusahaan
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
                    placeholder="Cari file media..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <IconFilter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full sm:w-auto">
                <IconPlus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </div>
          </div>

          {/* Media Files Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mediaFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.mimeType)}
                        <div>
                          <CardTitle className="text-lg line-clamp-1">{file.originalFilename}</CardTitle>
                          <CardDescription className="text-sm">
                            {file.filename}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(file.isActive)}
                        {getFileTypeBadge(file.mimeType)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ukuran:</span>
                          <span className="font-medium">{formatFileSize(file.fileSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensi:</span>
                          <span className="font-medium">{formatDimensions(file.width, file.height)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipe:</span>
                          <span className="font-medium">{file.mimeType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Upload oleh:</span>
                          <span className="font-medium">{file.uploadedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tanggal:</span>
                          <span className="font-medium text-xs">{file.createdAt}</span>
                        </div>
                      </div>
                      
                      {file.altText && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Alt Text:</p>
                          <p className="text-xs text-muted-foreground">{file.altText}</p>
                        </div>
                      )}
                      
                      {file.caption && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Caption:</p>
                          <p className="text-xs text-muted-foreground">{file.caption}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <IconEye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <IconDownload className="h-4 w-4 mr-2" />
                          Download
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
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total File</CardTitle>
                  <IconPhoto className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mediaFiles.length}</div>
                  <p className="text-xs text-muted-foreground">
                    File tersedia
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Images</CardTitle>
                  <Badge variant="default">{mediaFiles.filter(f => f.mimeType.startsWith('image/')).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mediaFiles.filter(f => f.mimeType.startsWith('image/')).length}</div>
                  <p className="text-xs text-muted-foreground">
                    File gambar
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Videos</CardTitle>
                  <Badge variant="secondary">{mediaFiles.filter(f => f.mimeType.startsWith('video/')).length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mediaFiles.filter(f => f.mimeType.startsWith('video/')).length}</div>
                  <p className="text-xs text-muted-foreground">
                    File video
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  <Badge variant="destructive">{mediaFiles.filter(f => f.mimeType === 'application/pdf').length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mediaFiles.filter(f => f.mimeType === 'application/pdf').length}</div>
                  <p className="text-xs text-muted-foreground">
                    File dokumen
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                  <IconFolder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatFileSize(mediaFiles.reduce((acc, file) => acc + file.fileSize, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ukuran total
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
