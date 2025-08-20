'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostForm } from '@/components/post-form';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { PostStatus } from '@/lib/types/dashboard';

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [initialData, setInitialData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    featured_image_url: string;
    author_id: string;
    category_id: string;
    status: PostStatus;
    published_at: string;
    is_featured: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await ClientDashboardService.getPostById(postId);
        setInitialData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          featured_image_url: post.featured_image_url || '',
          author_id: post.author_id || '',
          category_id: post.category_id || '',
          status: post.status,
          published_at: post.published_at || '',
          is_featured: post.is_featured || false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data artikel');
      } finally {
        setIsLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Memuat data artikel...</p>
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
        <PostForm 
          postId={postId}
          initialData={initialData}
        />
      )}
    </div>
  );
}
