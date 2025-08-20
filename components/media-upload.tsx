'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MediaService, MediaFile } from '@/lib/services/media.service';
import { IconUpload, IconX, IconFile, IconImage, IconDocument, IconTrash } from '@tabler/icons-react';

interface MediaUploadProps {
  onUploadSuccess?: (file: MediaFile) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function MediaUpload({
  onUploadSuccess,
  onUploadError,
  folder = 'blog-media',
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  allowedTypes = ['image/*', 'application/pdf', 'text/*'],
  multiple = false,
  className = ''
}: MediaUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if file type is allowed
  const isFileTypeAllowed = (file: File): boolean => {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
  };

  // Check if file size is within limit
  const isFileSizeAllowed = (file: File): boolean => {
    return file.size <= maxFileSize;
  };

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    
    // Validate files
    Array.from(files).forEach(file => {
      if (!isFileTypeAllowed(file)) {
        onUploadError?.(`File type ${file.type} tidak didukung`);
        return;
      }
      
      if (!isFileSizeAllowed(file)) {
        onUploadError?.(`File ${file.name} terlalu besar (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
        return;
      }
      
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Add files to uploading state
    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = uploadingFiles.length + i;
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadingFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
          ));
        }, 100);

        // Upload file
        const result = await MediaService.uploadFile(file, folder);
        
        clearInterval(progressInterval);
        
        if (result.success && result.file) {
          setUploadingFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: 100, status: 'success' } : f
          ));
          
          onUploadSuccess?.(result.file);
          
          // Remove from uploading list after delay
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
          }, 2000);
        } else {
          setUploadingFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, status: 'error', error: result.error } : f
          ));
          
          onUploadError?.(result.error || 'Upload gagal');
        }
      } catch (error) {
        clearInterval(progressInterval);
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === fileIndex ? { ...f, status: 'error', error: 'Upload gagal' } : f
        ));
        
        onUploadError?.(error instanceof Error ? error.message : 'Upload gagal');
      }
    }
  }, [folder, maxFileSize, allowedTypes, onUploadSuccess, onUploadError, uploadingFiles.length]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Remove uploading file
  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <IconImage className="h-8 w-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <IconDocument className="h-8 w-8 text-red-500" />;
    } else {
      return <IconFile className="h-8 w-8 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <CardContent className="p-6">
          <div
            className="text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <IconUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload File
            </h3>
            <p className="text-gray-600 mb-4">
              Drag & drop file ke sini atau{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                pilih file
              </button>
            </p>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p>File yang didukung: {allowedTypes.join(', ')}</p>
              <p>Ukuran maksimal: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">File yang sedang diupload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadingFiles.map((uploadingFile, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getFileIcon(uploadingFile.file)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {uploadingFile.file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUploadingFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                    {uploadingFile.status === 'success' && (
                      <Badge variant="default" className="text-xs">Selesai</Badge>
                    )}
                    {uploadingFile.status === 'error' && (
                      <Badge variant="destructive" className="text-xs">Error</Badge>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  {uploadingFile.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Error message */}
                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {uploadingFile.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
