'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { PostStatus } from '@/lib/types/dashboard';

interface PostFormProps {
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    featured_image_url: string;
    author_id: string;
    category_id: string;
    status: PostStatus;
    published_at: string;
    is_featured: boolean;
  };
}

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    featured_image_url: initialData?.featured_image_url || '',
    author_id: initialData?.author_id || '',
    category_id: initialData?.category_id || '',
    status: initialData?.status || 'draft' as PostStatus,
    published_at: initialData?.published_at || '',
    is_featured: initialData?.is_featured || false,
  });

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !postId) {
      const autoSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        published_at: formData.status === 'published' && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at || null
      };

      if (postId) {
        await ClientDashboardService.updatePost(postId, dataToSubmit);
      } else {
        await ClientDashboardService.createPost(dataToSubmit);
      }
      
      router.push('/dashboard/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {postId ? 'Edit Artikel' : 'Tambah Artikel Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Masukkan judul artikel"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-sm text-muted-foreground">
              URL artikel: /blog/{formData.slug}
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Ringkasan singkat artikel (opsional)"
              rows={3}
            />
          </div>

          {/* Featured Image URL */}
          <div className="space-y-2">
            <Label htmlFor="featured_image_url">URL Gambar Utama</Label>
            <Input
              id="featured_image_url"
              type="url"
              value={formData.featured_image_url}
              onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Author ID */}
          <div className="space-y-2">
            <Label htmlFor="author_id">ID Penulis</Label>
            <Input
              id="author_id"
              type="text"
              value={formData.author_id}
              onChange={(e) => handleInputChange('author_id', e.target.value)}
              placeholder="UUID penulis (opsional)"
            />
          </div>

          {/* Category ID */}
          <div className="space-y-2">
            <Label htmlFor="category_id">ID Kategori</Label>
            <Input
              id="category_id"
              type="text"
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              placeholder="UUID kategori (opsional)"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: PostStatus) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status artikel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Published At */}
          <div className="space-y-2">
            <Label htmlFor="published_at">Tanggal Publikasi</Label>
            <Input
              id="published_at"
              type="datetime-local"
              value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleInputChange('published_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
            />
            <p className="text-sm text-muted-foreground">
              Kosongkan untuk publikasi otomatis saat status diubah ke Published
            </p>
          </div>

          {/* Is Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange('is_featured', !!checked)}
            />
            <Label htmlFor="is_featured">Artikel Unggulan</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (postId ? 'Menyimpan...' : 'Membuat...') 
                : (postId ? 'Simpan Perubahan' : 'Buat Artikel')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
