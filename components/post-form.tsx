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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { PostStatus } from '@/lib/types/dashboard';

interface PostFormProps {
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image_url: string;
    author_name: string;
    category_id: string;
    status: PostStatus;
    published_at: string;
    is_featured: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
}

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featured_image_url: initialData?.featured_image_url || '',
    author_name: initialData?.author_name || '',
    category_id: initialData?.category_id || '',
    status: initialData?.status || 'draft' as PostStatus,
    published_at: initialData?.published_at || undefined,
    is_featured: initialData?.is_featured || false,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
  });

  // Load categories and authors
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesData = await ClientDashboardService.getCategories();
        setCategories(categoriesData);
        
        // Load authors
        const authorsData = await ClientDashboardService.getAuthors();
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    loadData();
  }, []);

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

  // Auto-generate meta title and description
  useEffect(() => {
    if (formData.title && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: formData.title }));
    }
    if (formData.excerpt && !formData.meta_description) {
      setFormData(prev => ({ ...prev, meta_description: formData.excerpt }));
    }
  }, [formData.title, formData.excerpt, formData.meta_title, formData.meta_description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        published_at: formData.status === 'published' && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at || undefined
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {postId ? 'Edit Artikel' : 'Tambah Artikel Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Konten</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
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

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Konten Artikel *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Tulis konten artikel Anda di sini..."
                  rows={15}
                  className="font-mono"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Gunakan HTML tags untuk formatting (h1, h2, p, ul, li, strong, em, a, img, dll.)
                </p>
              </div>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-6">
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

              {/* Author Selection */}
              <div className="space-y-2">
                <Label htmlFor="author_name">Penulis</Label>
                {authors.length > 0 ? (
                  <Select
                    value={formData.author_name}
                    onValueChange={(value) => handleInputChange('author_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penulis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada penulis</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.first_name} {author.last_name} - {author.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="author_name"
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => handleInputChange('author_name', e.target.value)}
                    placeholder="Nama penulis"
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  {authors.length > 0 
                    ? 'Pilih penulis dari daftar yang tersedia'
                    : 'Untuk saat ini menggunakan input manual. Akan diupgrade ke dropdown selection.'
                  }
                </p>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori</Label>
                {categories.length > 0 ? (
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="category_id"
                    type="text"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    placeholder="UUID kategori (opsional)"
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  {categories.length > 0 
                    ? 'Pilih kategori dari daftar yang tersedia'
                    : 'Untuk saat ini menggunakan input manual. Akan diupgrade ke dropdown selection.'
                  }
                </p>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="Title untuk SEO (default: judul artikel)"
                />
                <p className="text-sm text-muted-foreground">
                  Panjang optimal: 50-60 karakter
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Deskripsi untuk SEO (default: excerpt artikel)"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Panjang optimal: 150-160 karakter
                </p>
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  placeholder="Kata kunci dipisahkan dengan koma"
                />
                <p className="text-sm text-muted-foreground">
                  Contoh: web development, teknologi, inovasi
                </p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
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
            </TabsContent>
          </Tabs>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
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
