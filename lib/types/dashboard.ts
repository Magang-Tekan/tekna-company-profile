// Types for dashboard data based on Supabase schema
import { ComponentType } from 'react';

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';
export type PostStatus = 'draft' | 'published' | 'archived';

export interface DashboardStats {
  title: string;
  value: string;
  description: string;
  icon?: ComponentType<{ className?: string }>; // Icon component (optional, will be added in dashboard page)
  change: string;
  changeType: 'positive' | 'negative' | 'default';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  description?: string;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  status: PostStatus;
  views: number;
  publishedAt: string | null;
}

export interface DashboardData {
  stats: DashboardStats[];
  recentProjects: Project[];
  recentPosts: Post[];
  servicesCount: number;
}

export interface SupabaseProject {
  id: string;
  name: string;
  client_name: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  project_translations: Array<{
    short_description: string | null;
  }>;
}

export interface SupabasePost {
  id: string;
  title: string;
  status: string;
  view_count: number | null;
  published_at: string | null;
  team_members: Array<{
    first_name: string;
    last_name: string;
  }> | null;
}

export interface SupabaseTeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  department: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

export interface SupabaseService {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface SupabaseTestimonial {
  id: string;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_avatar_url: string | null;
  testimonial_text: string;
  rating: number | null;
  is_active: boolean;
  is_featured: boolean;
}
