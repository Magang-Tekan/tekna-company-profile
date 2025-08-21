'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { IconDeviceFloppy, IconX, IconUser, IconUpload } from '@tabler/icons-react';

interface AuthorFormProps {
  authorId?: string;
  initialData?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    avatar_url: string;
    linkedin_url: string;
    twitter_url: string;
    github_url: string;
    is_active: boolean;
    sort_order: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  avatar_url: string;
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
  is_active: boolean;
  sort_order: number;
}

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  avatar_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  sort_order?: string;
}

const DEPARTMENTS = [
  'Executive',
  'Technology',
  'Development',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Other'
];

export function AuthorForm({ authorId, initialData, onSuccess, onCancel }: AuthorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    position: initialData?.position || '',
    department: initialData?.department || '',
    avatar_url: initialData?.avatar_url || '',
    linkedin_url: initialData?.linkedin_url || '',
    twitter_url: initialData?.twitter_url || '',
    github_url: initialData?.github_url || '',
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Nama depan wajib diisi';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'Nama depan minimal 2 karakter';
    } else if (formData.first_name.trim().length > 50) {
      newErrors.first_name = 'Nama depan maksimal 50 karakter';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Nama belakang wajib diisi';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Nama belakang minimal 2 karakter';
    } else if (formData.last_name.trim().length > 50) {
      newErrors.last_name = 'Nama belakang maksimal 50 karakter';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }

    // Phone validation
    if (formData.phone.trim() && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    // Position validation
    if (!formData.position.trim()) {
      newErrors.position = 'Posisi wajib diisi';
    } else if (formData.position.trim().length < 2) {
      newErrors.position = 'Posisi minimal 2 karakter';
    } else if (formData.position.trim().length > 100) {
      newErrors.position = 'Posisi maksimal 100 karakter';
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Departemen wajib dipilih';
    }

    // URL validations
    if (formData.linkedin_url.trim() && !isValidUrl(formData.linkedin_url.trim())) {
      newErrors.linkedin_url = 'URL LinkedIn tidak valid';
    }
    if (formData.twitter_url.trim() && !isValidUrl(formData.twitter_url.trim())) {
      newErrors.twitter_url = 'URL Twitter tidak valid';
    }
    if (formData.github_url.trim() && !isValidUrl(formData.github_url.trim())) {
      newErrors.github_url = 'URL GitHub tidak valid';
    }

    // Sort order validation
    if (formData.sort_order < 0) {
      newErrors.sort_order = 'Urutan tidak boleh negatif';
    } else if (formData.sort_order > 999) {
      newErrors.sort_order = 'Urutan maksimal 999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (authorId) {
        await ClientDashboardService.updateAuthor(authorId, formData);
      } else {
        await ClientDashboardService.createAuthor(formData);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/authors');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving author:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="h-5 w-5" />
          {authorId ? 'Edit Author' : 'Tambah Author Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Pribadi</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="first_name">Nama Depan *</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Nama depan"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last_name">Nama Belakang *</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Nama belakang"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+62-812-3456-7890"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Profesional</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Posisi *</Label>
                <Input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="CEO, Developer, Designer"
                  className={errors.position ? 'border-red-500' : ''}
                />
                {errors.position && (
                  <p className="text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Departemen *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-600">{errors.department}</p>
                )}
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort_order">Urutan</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                max="999"
                className={errors.sort_order ? 'border-red-500' : ''}
              />
              {errors.sort_order && (
                <p className="text-sm text-red-600">{errors.sort_order}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Urutan untuk mengatur posisi author (0 = paling atas)
              </p>
            </div>
          </div>

          {/* Social Media & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Sosial & Link</h3>
            
            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL Avatar</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className={errors.avatar_url ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* TODO: Open media library */}}
                >
                  <IconUpload className="h-4 w-4" />
                </Button>
              </div>
              {errors.avatar_url && (
                <p className="text-sm text-red-600">{errors.avatar_url}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">URL LinkedIn</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className={errors.linkedin_url ? 'border-red-500' : ''}
              />
              {errors.linkedin_url && (
                <p className="text-sm text-red-600">{errors.linkedin_url}</p>
              )}
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <Label htmlFor="twitter_url">URL Twitter</Label>
              <Input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                placeholder="https://twitter.com/username"
                className={errors.twitter_url ? 'border-red-500' : ''}
              />
              {errors.twitter_url && (
                <p className="text-sm text-red-600">{errors.twitter_url}</p>
              )}
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github_url">URL GitHub</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
                placeholder="https://github.com/username"
                className={errors.github_url ? 'border-red-500' : ''}
              />
              {errors.github_url && (
                <p className="text-sm text-red-600">{errors.github_url}</p>
              )}
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', !!checked)}
            />
            <Label htmlFor="is_active">Author Aktif</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <IconX className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {isLoading 
                ? (authorId ? 'Menyimpan...' : 'Membuat...') 
                : (authorId ? 'Simpan Perubahan' : 'Buat Author')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}