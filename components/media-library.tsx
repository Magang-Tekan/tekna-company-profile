'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaService, type MediaFile } from '@/lib/services/media.service';
import { IconUpload, IconX, IconCopy, IconDownload, IconLoader2 } from '@tabler/icons-react';
import Image from 'next/image';

interface MediaLibraryProps {
  onSelect?: (file: MediaFile) => void;
  onClose?: () => void;
}

export function MediaLibrary({ onSelect, onClose }: MediaLibraryProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media files on component mount
  const loadMediaFiles = async () => {
    setIsLoading(true);
    try {
      const files = await MediaService.getMediaFiles();
      setMediaFiles(files);
    } catch (error) {
      console.error('Error loading media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (const file of Array.from(files)) {
        const result = await MediaService.uploadFile(file);
        if (result.success && result.file) {
          setMediaFiles(prev => [result.file!, ...prev]);
        } else {
          console.error('Upload failed:', result.error);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  // Load media files on mount
  useEffect(() => {
    loadMediaFiles();
  }, []);

  const handleFileSelect = (file: MediaFile) => {
    if (onSelect) {
      onSelect(file);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const success = await MediaService.deleteMediaFile(fileId);
      if (success) {
        setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('File URL copied successfully!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = mediaFiles.filter(file =>
    file.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.caption?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Media Library</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="library">Media Library</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <IconUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload New File
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop image files here, or click to select files
              </p>
              
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mb-4"
              >
                <IconUpload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Pilih File'}
              </Button>

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Cari File</Label>
              <Input
                id="search"
                type="text"
                placeholder="Cari berdasarkan nama file, alt text, atau caption..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Media Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <IconUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Tidak ada file yang cocok dengan pencarian' : 'Belum ada file yang diupload'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="group">
                    <CardContent className="p-3">
                      {/* Image Preview */}
                      <div className="relative aspect-square mb-3 overflow-hidden rounded-md">
                        <Image
                          src={file.file_url}
                          alt={file.alt_text || file.original_filename}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-105 transition-transform duration-200"
                        />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleFileSelect(file)}
                            >
                              Pilih
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleFileDelete(file.id)}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium truncate" title={file.original_filename}>
                          {file.original_filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.file_size)}
                        </p>
                        {file.width && file.height && (
                          <p className="text-xs text-muted-foreground">
                            {file.width} × {file.height}
                          </p>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-1 mt-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyFileUrl(file.file_url)}
                          className="flex-1"
                        >
                          <IconCopy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(file.file_url, '_blank')}
                          className="flex-1"
                        >
                          <IconDownload className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
