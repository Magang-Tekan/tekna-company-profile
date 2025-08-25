import { createClient } from '@/lib/supabase/client';

// Career Types and Interfaces
export interface CareerCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerLocation {
  id: string;
  name: string;
  slug: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  timezone: string;
  is_remote: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerLevel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  years_min: number;
  years_max?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerSkill {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerPositionSkill {
  id: string;
  position_id: string;
  skill_id: string;
  level: 'required' | 'preferred' | 'nice-to-have';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
  skill?: CareerSkill;
}

export interface CareerPosition {
  id: string;
  company_id?: string;
  category_id?: string;
  location_id?: string;
  type_id?: string;
  level_id?: string;
  title: string;
  slug: string;
  summary?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  salary_type: string;
  application_deadline?: string;
  start_date?: string;
  remote_allowed: boolean;
  travel_required: boolean;
  travel_percentage: number;
  featured: boolean;
  urgent: boolean;
  status: 'draft' | 'open' | 'closed' | 'filled';
  views_count: number;
  applications_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_by?: string;
  updated_by?: string;
  is_active: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  category?: CareerCategory;
  location?: CareerLocation;
  type?: CareerType;
  level?: CareerLevel;
  skills?: CareerPositionSkill[];
}

export interface CareerApplication {
  id: string;
  position_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  cover_letter?: string;
  resume_url?: string;
  additional_documents?: { name: string; url: string; type: string }[];
  status: 'submitted' | 'reviewing' | 'interview_scheduled' | 'interview_completed' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  notes?: string;
  source?: string;
  applied_at: string;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  position?: CareerPosition;
}

export interface CareerApplicationActivity {
  id: string;
  application_id: string;
  activity_type: string;
  old_status?: string;
  new_status?: string;
  description?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// Filters and Search
export interface CareerFilters {
  category?: string;
  location?: string;
  type?: string;
  level?: string;
  remote?: boolean;
  featured?: boolean;
  search?: string;
  salary_min?: number;
  salary_max?: number;
}

export interface CareerSearchParams {
  filters?: CareerFilters;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'title' | 'salary_high' | 'salary_low' | 'deadline';
}

export class CareerService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  // Public methods
  async getPublicPositions(params: CareerSearchParams): Promise<{
    positions: CareerPosition[];
    total: number;
    totalPages: number;
  }> {
    try {
      let query = this.supabase
        .from('career_positions')
        .select(`
          *,
          category:career_categories(*),
          location:career_locations(*),
          type:career_types(*),
          level:career_levels(*),
          skills:career_position_skills(
            id,
            level,
            proficiency,
            skill:career_skills(*)
          )
        `, { count: 'exact' })
        .eq('status', 'open')
        .eq('is_active', true);

      // Apply filters
      if (params.filters?.search) {
        query = query.or(`title.ilike.%${params.filters.search}%,description.ilike.%${params.filters.search}%`);
      }
      if (params.filters?.category) {
        query = query.eq('category.slug', params.filters.category);
      }
      if (params.filters?.location) {
        query = query.eq('location.slug', params.filters.location);
      }
      if (params.filters?.type) {
        query = query.eq('type.slug', params.filters.type);
      }
      if (params.filters?.level) {
        query = query.eq('level.slug', params.filters.level);
      }
      if (params.filters?.remote) {
        query = query.eq('remote_allowed', true);
      }

      // Apply sorting
      switch (params.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'salary_high':
          query = query.order('salary_max', { ascending: false });
          break;
        case 'salary_low':
          query = query.order('salary_min', { ascending: true });
          break;
        case 'deadline':
          query = query.order('application_deadline', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      const limit = params.limit || 10;
      const offset = ((params.page || 1) - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching public positions:', error);
        return { positions: [], total: 0, totalPages: 0 };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        positions: data || [],
        total,
        totalPages
      };
    } catch (error) {
      console.error('Error in getPublicPositions:', error);
      return { positions: [], total: 0, totalPages: 0 };
    }
  }

  async getPublicPositionBySlug(slug: string): Promise<CareerPosition | null> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select(`
          *,
          category:career_categories(*),
          location:career_locations(*),
          type:career_types(*),
          level:career_levels(*),
          skills:career_position_skills(
            id,
            level,
            proficiency,
            skill:career_skills(*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'open')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching position by slug:', error);
        return null;
      }

      // Increment views count
      await this.supabase
        .from('career_positions')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);

      return data;
    } catch (error) {
      console.error('Error in getPublicPositionBySlug:', error);
      return null;
    }
  }

  async getRelatedPositions(positionId: string, categoryId: string, limit: number = 3): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select(`
          *,
          category:career_categories(*),
          location:career_locations(*),
          type:career_types(*),
          level:career_levels(*)
        `)
        .eq('category_id', categoryId)
        .neq('id', positionId)
        .eq('status', 'open')
        .eq('is_active', true)
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching related positions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRelatedPositions:', error);
      return [];
    }
  }

  async getFeaturedPositions(limit: number = 6): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select(`
          *,
          category:career_categories(*),
          location:career_locations(*),
          type:career_types(*),
          level:career_levels(*)
        `)
        .eq('featured', true)
        .eq('status', 'open')
        .eq('is_active', true)
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured positions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedPositions:', error);
      return [];
    }
  }

  async getPublicCategories(): Promise<CareerCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching public categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicCategories:', error);
      return [];
    }
  }

  async getPublicLocations(): Promise<CareerLocation[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_locations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching public locations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicLocations:', error);
      return [];
    }
  }

  async getPublicTypes(): Promise<CareerType[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching public types:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicTypes:', error);
      return [];
    }
  }

  async getPublicLevels(): Promise<CareerLevel[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_levels')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching public levels:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicLevels:', error);
      return [];
    }
  }

  async submitApplication(application: Omit<CareerApplication, 'id' | 'status' | 'applied_at' | 'last_activity_at' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_applications')
        .insert({
          ...application,
          status: 'submitted',
          applied_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error submitting application:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in submitApplication:', error);
      return false;
    }
  }

  // Admin methods
  async getAllPositions(): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select(`
          *,
          category:career_categories(*),
          location:career_locations(*),
          type:career_types(*),
          level:career_levels(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all positions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPositions:', error);
      return [];
    }
  }

  async getAllCategories(): Promise<CareerCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_categories')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching all categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      return [];
    }
  }

  async getAllLocations(): Promise<CareerLocation[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_locations')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching all locations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllLocations:', error);
      return [];
    }
  }

  async getAllTypes(): Promise<CareerType[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_types')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching all types:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllTypes:', error);
      return [];
    }
  }

  async getAllLevels(): Promise<CareerLevel[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_levels')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching all levels:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllLevels:', error);
      return [];
    }
  }

  async updatePosition(id: string, updates: Partial<CareerPosition>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_positions')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating position:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePosition:', error);
      return false;
    }
  }

  async deletePosition(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_positions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting position:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePosition:', error);
      return false;
    }
  }

  async createPosition(data: Partial<CareerPosition>): Promise<CareerPosition | null> {
    try {
      const { data: position, error } = await this.supabase
        .from('career_positions')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          category:career_categories(*),
          location:career_locations(*),
          type:career_types(*),
          level:career_levels(*)
        `)
        .single();

      if (error) {
        console.error('Error creating position:', error);
        return null;
      }

      return position;
    } catch (error) {
      console.error('Error in createPosition:', error);
      return null;
    }
  }

  // Category Management
  async getCategories(): Promise<CareerCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_categories')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  async createCategory(data: { name: string; description?: string | null }): Promise<CareerCategory | null> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Get next sort order
      const { data: maxSort } = await this.supabase
        .from('career_categories')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const nextSortOrder = (maxSort?.sort_order || 0) + 1;

      const { data: category, error } = await this.supabase
        .from('career_categories')
        .insert([{
          name: data.name,
          slug,
          description: data.description,
          sort_order: nextSortOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating category:', error);
        return null;
      }

      return category;
    } catch (error) {
      console.error('Error in createCategory:', error);
      return null;
    }
  }

  async updateCategory(id: string, data: { name: string; description?: string | null }): Promise<boolean> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await this.supabase
        .from('career_categories')
        .update({
          name: data.name,
          slug,
          description: data.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating category:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCategory:', error);
      return false;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      return false;
    }
  }

  async getPositionsByCategory(categoryId: string): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select('*')
        .eq('category_id', categoryId);

      if (error) {
        console.error('Error fetching positions by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPositionsByCategory:', error);
      return [];
    }
  }

  // Location Management
  async createLocation(data: { 
    name: string; 
    address?: string | null;
    city: string;
    state?: string | null;
    country: string;
    timezone: string;
    is_remote: boolean;
  }): Promise<CareerLocation | null> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Get next sort order
      const { data: maxSort } = await this.supabase
        .from('career_locations')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const nextSortOrder = (maxSort?.sort_order || 0) + 1;

      const { data: location, error } = await this.supabase
        .from('career_locations')
        .insert([{
          name: data.name,
          slug,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          timezone: data.timezone,
          is_remote: data.is_remote,
          sort_order: nextSortOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating location:', error);
        return null;
      }

      return location;
    } catch (error) {
      console.error('Error in createLocation:', error);
      return null;
    }
  }

  async updateLocation(id: string, data: {
    name: string;
    address?: string | null;
    city: string;
    state?: string | null;
    country: string;
    timezone: string;
    is_remote: boolean;
  }): Promise<boolean> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await this.supabase
        .from('career_locations')
        .update({
          name: data.name,
          slug,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          timezone: data.timezone,
          is_remote: data.is_remote,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating location:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateLocation:', error);
      return false;
    }
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_locations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting location:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteLocation:', error);
      return false;
    }
  }

  async getPositionsByLocation(locationId: string): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select('*')
        .eq('location_id', locationId);

      if (error) {
        console.error('Error fetching positions by location:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPositionsByLocation:', error);
      return [];
    }
  }

  // Type Management
  async createType(data: { name: string; description?: string | null }): Promise<CareerType | null> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Get next sort order
      const { data: maxSort } = await this.supabase
        .from('career_types')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const nextSortOrder = (maxSort?.sort_order || 0) + 1;

      const { data: type, error } = await this.supabase
        .from('career_types')
        .insert([{
          name: data.name,
          slug,
          description: data.description,
          sort_order: nextSortOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating type:', error);
        return null;
      }

      return type;
    } catch (error) {
      console.error('Error in createType:', error);
      return null;
    }
  }

  async updateType(id: string, data: { name: string; description?: string | null }): Promise<boolean> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await this.supabase
        .from('career_types')
        .update({
          name: data.name,
          slug,
          description: data.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating type:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateType:', error);
      return false;
    }
  }

  async deleteType(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting type:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteType:', error);
      return false;
    }
  }

  async getPositionsByType(typeId: string): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select('*')
        .eq('type_id', typeId);

      if (error) {
        console.error('Error fetching positions by type:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPositionsByType:', error);
      return [];
    }
  }

  // Level Management
  async createLevel(data: { 
    name: string; 
    description?: string | null;
    years_min: number;
    years_max?: number | null;
  }): Promise<CareerLevel | null> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Get next sort order
      const { data: maxSort } = await this.supabase
        .from('career_levels')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const nextSortOrder = (maxSort?.sort_order || 0) + 1;

      const { data: level, error } = await this.supabase
        .from('career_levels')
        .insert([{
          name: data.name,
          slug,
          description: data.description,
          years_min: data.years_min,
          years_max: data.years_max,
          sort_order: nextSortOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating level:', error);
        return null;
      }

      return level;
    } catch (error) {
      console.error('Error in createLevel:', error);
      return null;
    }
  }

  async updateLevel(id: string, data: { 
    name: string; 
    description?: string | null;
    years_min: number;
    years_max?: number | null;
  }): Promise<boolean> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await this.supabase
        .from('career_levels')
        .update({
          name: data.name,
          slug,
          description: data.description,
          years_min: data.years_min,
          years_max: data.years_max,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating level:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateLevel:', error);
      return false;
    }
  }

  async deleteLevel(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('career_levels')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting level:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteLevel:', error);
      return false;
    }
  }

  async getPositionsByLevel(levelId: string): Promise<CareerPosition[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_positions')
        .select('*')
        .eq('level_id', levelId);

      if (error) {
        console.error('Error fetching positions by level:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPositionsByLevel:', error);
      return [];
    }
  }

  // Application Management
  async getAllApplications(): Promise<CareerApplication[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_applications')
        .select(`
          *,
          position:career_positions(
            id,
            title,
            slug
          )
        `)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching all applications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      return [];
    }
  }

  async updateApplicationStatus(
    applicationId: string, 
    status: CareerApplication['status'], 
    notes?: string
  ): Promise<boolean> {
    try {
      const updates: Partial<CareerApplication> = {
        status,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updates.notes = notes;
      }

      const { error } = await this.supabase
        .from('career_applications')
        .update(updates)
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        return false;
      }

      // Create activity log
      await this.supabase
        .from('career_application_activities')
        .insert([{
          application_id: applicationId,
          activity_type: 'status_change',
          new_status: status,
          description: `Status changed to ${status}`,
          notes: notes || null,
          created_at: new Date().toISOString()
        }]);

      return true;
    } catch (error) {
      console.error('Error in updateApplicationStatus:', error);
      return false;
    }
  }

  async getApplicationById(applicationId: string): Promise<CareerApplication | null> {
    try {
      const { data, error } = await this.supabase
        .from('career_applications')
        .select(`
          *,
          position:career_positions(
            id,
            title,
            slug,
            category:career_categories(name),
            location:career_locations(name),
            type:career_types(name),
            level:career_levels(name)
          )
        `)
        .eq('id', applicationId)
        .single();

      if (error) {
        console.error('Error fetching application by id:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getApplicationById:', error);
      return null;
    }
  }

  async getApplicationActivities(applicationId: string): Promise<CareerApplicationActivity[]> {
    try {
      const { data, error } = await this.supabase
        .from('career_application_activities')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching application activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getApplicationActivities:', error);
      return [];
    }
  }

  async deleteApplication(applicationId: string): Promise<boolean> {
    try {
      // Delete activities first (foreign key constraint)
      await this.supabase
        .from('career_application_activities')
        .delete()
        .eq('application_id', applicationId);

      const { error } = await this.supabase
        .from('career_applications')
        .delete()
        .eq('id', applicationId);

      if (error) {
        console.error('Error deleting application:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteApplication:', error);
      return false;
    }
  }
}
