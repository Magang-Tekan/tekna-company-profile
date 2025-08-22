'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostForm } from '@/components/post-form';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { PostStatus } from '@/lib/types/dashboard';
import Link from 'next/link';

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [initialData, setInitialData] = useState<{
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
          content: '',
          featured_image_url: post.featured_image_url || '',
          author_name: post.author_name || '',
          category_id: post.category_id || '',
          status: post.status,
          published_at: post.published_at || '',
          is_featured: post.is_featured || false,
          meta_title: post.title || '',
          meta_description: post.excerpt || '',
          meta_keywords: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article data');
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
            <p className="text-destructive mb-4">{error}</p>
            <Link
              href="/dashboard/blog"
              className="text-primary hover:underline"
            >
              ← Kembali ke Blog
            </Link>
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
