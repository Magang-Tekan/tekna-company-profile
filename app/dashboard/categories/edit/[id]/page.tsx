'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CategoryForm } from '@/components/category-form';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [initialData, setInitialData] = useState<{
    name: string;
    slug: string;
    description: string;
    color: string;
    is_active: boolean;
    sort_order: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const category = await ClientDashboardService.getCategoryById(categoryId);
        setInitialData({
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          color: category.color || '#3B82F6',
          is_active: category.is_active ?? true,
          sort_order: category.sort_order || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data kategori');
      } finally {
        setIsLoading(false);
      }
    }

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Memuat data kategori...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 hover:underline"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {initialData && (
        <CategoryForm 
          categoryId={categoryId}
          initialData={initialData}
        />
      )}
    </div>
  );
}
