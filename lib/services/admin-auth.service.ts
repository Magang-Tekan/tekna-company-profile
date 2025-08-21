import { createClient } from "@/lib/supabase/client";

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  is_active: boolean;
  profile?: UserProfile;
}

export interface PaginatedResult<T> {
  data: T[];
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
}

export class AdminAuthService {
  /**
   * Authenticate admin user
   */
  static async authenticateAdmin(email: string, password: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify user is admin
      if (data.user) {
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('is_active', true)
          .single();

        if (roleError || !userRole) {
          throw new Error('Access denied. Admin privileges required.');
        }

        return { user: data.user, userRole };
      }

      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Admin authentication error:', error);
      throw error;
    }
  }

  static async getCurrentAdmin(): Promise<AdminUser> {
    const supabase = createClient();
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Not authenticated');
        
        return await this.getUserFromDatabase(user.id);
      }

      return await this.getUserFromDatabase(session.user.id);
    } catch (error) {
      console.error('Error getting current admin:', error);
      throw error;
    }
  }

  private static async getUserFromDatabase(userId: string): Promise<AdminUser> {
    const supabase = createClient();
    
    try {
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (roleError || !userRole) {
        throw new Error('Admin access required');
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: { user } } = await supabase.auth.getUser();
      
      return {
        id: userId,
        email: user?.email || 'unknown@email.com',
        role: userRole.role,
        is_active: userRole.is_active,
        profile: userProfile || undefined
      };
    } catch (error) {
      console.error('Error getting user from database:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get all admin users (super admin only)
   */
  static async getAllAdminUsers(): Promise<AdminUser[]> {
    const supabase = createClient();
    
    try {
      // 1. Get all active user roles
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (roleError) throw roleError;
      if (!userRoles) return [];

      const userIds = userRoles.map(ur => ur.user_id);

      // 2. Get all corresponding user profiles
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // 3. Get user data (like email) from auth.users
      // This is tricky on the client-side for all users. The original code also had a placeholder.
      // For now, we'll keep the placeholder and focus on fixing the data fetching.
      // A server-side call would be needed to get all user emails securely.

      const profilesByUserId = new Map(userProfiles?.map(p => [p.user_id, p]));

      const adminUsers: AdminUser[] = userRoles.map(userRole => {
        const profile = profilesByUserId.get(userRole.user_id);
        return {
          id: userRole.user_id,
          email: 'user@example.com', // Placeholder, as in original code
          role: userRole.role,
          is_active: userRole.is_active,
          profile: profile || undefined
        };
      });

      return adminUsers;
    } catch (error) {
      console.error('Error getting admin users:', error);
      throw error;
    }
  }

  /**
   * Create new admin user (super admin only)
   * Note: This method should be called after creating user in Supabase Auth
   */
  static async createAdminUser(userData: {
    user_id: string;
    role: 'admin' | 'editor';
    first_name?: string;
    last_name?: string;
  }) {
    const supabase = createClient();
    
    try {
      // Insert user role
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user_id,
          role: userData.role,
          is_active: true
        })
        .select()
        .single();

      if (roleError) throw roleError;

      // Insert user profile if name provided
      if (userData.first_name || userData.last_name) {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: userData.user_id,
            first_name: userData.first_name,
            last_name: userData.last_name
          });
      }

      return userRole;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  /**
   * Update admin user (super admin only)
   */
  static async updateAdminUser(userId: string, userData: Partial<AdminUser>) {
    const supabase = createClient();
    
    try {
      // Update user role
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .update({
          role: userData.role,
          is_active: userData.is_active
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (roleError) throw roleError;

      // Update user profile if provided
      if (userData.profile) {
        await supabase
          .from('user_profiles')
          .upsert({
            ...userData.profile,
            user_id: userId
          });
      }

      return userRole;
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  }

  /**
   * Deactivate admin user (super admin only)
   */
  static async deactivateAdminUser(userId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deactivating admin user:', error);
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  static async hasPermission(requiredRole: 'admin' | 'editor') {
    try {
      const currentAdmin = await this.getCurrentAdmin();
      
      const roleHierarchy: Record<string, number> = {
        'admin': 2,
        'editor': 1
      };

      return roleHierarchy[currentAdmin.role] >= roleHierarchy[requiredRole];
    } catch {
      return false;
    }
  }

  /**
   * Logout admin user
   */
  static async logout() {
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
}
