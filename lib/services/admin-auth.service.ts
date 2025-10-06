import { createClient, createAdminClient } from "@/lib/supabase/client";

export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "editor" | "hr";
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
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "editor" | "hr";
  is_active: boolean;
  profile?: UserProfile;
  // optional display_name is returned from server (auth metadata)
  display_name?: string;
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
  static async authenticateAdmin(identifier: string, password: string) {
    const supabase = createClient();

    try {
      // identifier may be an email or a display name (username).
      let email = identifier;

      // rudimentary check: if there's no @, treat as display name and try to resolve to an email
      if (!identifier.includes("@")) {
        const users = await this.getAllAdminUsers();
        const match = users.find((u) => {
          const display = (u as AdminUser).display_name as string | undefined;
          const legacy = u.profile?.first_name as string | undefined; // backward compatibility
          return [display, legacy]
            .filter(Boolean)
            .some((d) => d?.toLowerCase() === identifier.toLowerCase());
        });

        if (!match) {
          throw new Error("User not found for provided display name");
        }

        email = match.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify user is admin
      if (data.user) {
        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("is_active", true)
          .single();

        if (roleError || !userRole) {
          throw new Error("Access denied. Admin privileges required.");
        }

        return { user: data.user, userRole };
      }

      throw new Error("Authentication failed");
    } catch (error) {
      console.error("Admin authentication error:", error);
      throw error;
    }
  }

  static async getCurrentAdmin(): Promise<AdminUser> {
    const supabase = createClient();

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Not authenticated");

        return await this.getUserFromDatabase(user.id);
      }

      return await this.getUserFromDatabase(session.user.id);
    } catch (error) {
      console.error("Error getting current admin:", error);
      throw error;
    }
  }

  private static async getUserFromDatabase(userId: string): Promise<AdminUser> {
    const supabase = createClient();

    try {
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (roleError || !userRole) {
        // Check if it's a token expiration issue
        if (roleError?.code === 'PGRST116' || roleError?.message?.includes('JWT')) {
          throw new Error("Token expired - please login again");
        }
        throw new Error("Admin access required");
      }

      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // For backward compatibility, map auth user metadata.display_name into profile.first_name

      const displayName = user?.user_metadata?.display_name as
        | string
        | undefined;

      const profile = userProfile || ({} as Partial<UserProfile>);
      if (displayName) {
        // keep existing shape where UI reads profile.first_name
        (profile as Partial<UserProfile>).first_name = displayName;
      }

      return {
        id: userId,
        email: user?.email || "unknown@email.com",
        role: userRole.role,
        is_active: userRole.is_active,
        profile: Object.keys(profile).length ? profile : undefined,
      };
    } catch (error) {
      console.error("Error getting user from database:", error);
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
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    profileData: Partial<UserProfile> & { display_name?: string }
  ) {
    const supabase = createClient();
    try {
      // If display_name is provided, update the Supabase Auth user metadata for the current user.
      // This updates the authenticated user's metadata (display_name) rather than storing name in user_profiles.
      if (profileData.display_name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { display_name: profileData.display_name },
        });
        if (authError) {
          console.error("Error updating auth user metadata:", authError);
          throw authError;
        }
      }

      // Update/insert any additional profile fields (avatar_url, preferences) in user_profiles table.
      const updatable: Partial<UserProfile> = {};
      if (profileData.avatar_url) updatable.avatar_url = profileData.avatar_url;
      if (profileData.preferences)
        updatable.preferences = profileData.preferences;

      if (Object.keys(updatable).length > 0) {
        // Try to update existing row
        const { data, error: updateError } = await supabase
          .from("user_profiles")
          .update(updatable)
          .eq("user_id", userId)
          .select()
          .single();

        // If the update fails because the row doesn't exist, insert it instead.
        if (updateError) {
          if (updateError.code === "PGRST116") {
            const { data: insertData, error: insertError } = await supabase
              .from("user_profiles")
              .insert({ user_id: userId, ...updatable })
              .select()
              .single();
            if (insertError) throw insertError;
            return insertData;
          }
          throw updateError;
        }
        return data;
      }

      // Nothing else to update in user_profiles
      return null;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Get all admin users (super admin only)
   */
  static async getAllAdminUsers(): Promise<AdminUser[]> {
    // Server-side retrieval using service role client.
    try {
      const supabase = createAdminClient();

      // Fetch all admin role rows
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) {
        console.error("Error fetching user_roles:", rolesError);
        return [];
      }

      const userIds = (roles || []).map((r: UserRole) => r.user_id);

      // Fetch profiles for those users
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("*")
        .in("user_id", userIds || []);
      const profilesData: UserProfile[] = (profiles || []) as UserProfile[];

      // Fetch auth users via admin API
  type AuthUser = { id: string; email?: string; user_metadata?: { display_name?: string } | Record<string, unknown> };
      let authUsers: AuthUser[] = [];
      try {
        const listResp = await supabase.auth.admin.listUsers();
        // new supabase client may return { data: { users: [] } } or { data: users }
        authUsers = (listResp?.data?.users || listResp?.data || []) as AuthUser[];
      } catch (e) {
        // fallback: empty
        console.warn("Could not list auth users via admin client:", e);
      }

      // Map roles to AdminUser shape
      const adminUsers: AdminUser[] = (roles || []).map((r: UserRole) => {
        const profile = profilesData.find((p) => p.user_id === r.user_id) || undefined;
        const authUser = authUsers.find((u) => u.id === r.user_id);
        // extract display_name from user_metadata if available
        let display_name: string | undefined = undefined;
        if (authUser && typeof authUser.user_metadata === "object") {
          const meta = authUser.user_metadata as Record<string, unknown>;
          if (typeof meta["display_name"] === "string") {
            display_name = meta["display_name"];
          }
        }
        display_name = display_name || profile?.first_name || undefined;

        return {
          id: r.user_id,
          email: authUser?.email || "",
          role: r.role,
          is_active: r.is_active,
          profile: profile || undefined,
          display_name,
        } as AdminUser;
      });

      return adminUsers;
    } catch (error) {
      console.error("Error getting admin users:", error);
      throw error;
    }
  }

  /**
   * Create new admin user (super admin only)
   * Note: This method should be called after creating user in Supabase Auth
   */
  static async createAdminUser(userData: {
    user_id: string;
    role: "admin" | "editor" | "hr";
    display_name?: string;
  }) {
    const supabase = createClient();

    try {
      // Insert user role
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userData.user_id,
          role: userData.role,
          is_active: true,
        })
        .select()
        .single();

      if (roleError) throw roleError;

      // Insert user profile if display_name provided (map to first_name for legacy)
      if (userData.display_name) {
        await supabase.from("user_profiles").insert({
          user_id: userData.user_id,
          first_name: userData.display_name,
          last_name: "",
        });
      }

      return userRole;
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  }

  /**
   * Create complete admin user including Supabase Auth user
   * This is the main method that should be used for creating new admin users
   */
  static async createCompleteAdminUser(userData: {
    email: string;
    password: string;
    role: "admin" | "editor" | "hr";
    display_name?: string;
  }) {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create admin user");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating complete admin user:", error);
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
        .from("user_roles")
        .update({
          role: userData.role,
          is_active: userData.is_active,
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (roleError) throw roleError;

      // Update user profile if provided
      if (userData.profile) {
        await supabase.from("user_profiles").upsert({
          ...userData.profile,
          user_id: userId,
        });
      }

      return userRole;
    } catch (error) {
      console.error("Error updating admin user:", error);
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
        .from("user_roles")
        .update({ is_active: false })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deactivating admin user:", error);
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  static async hasPermission(requiredRole: "admin" | "editor" | "hr") {
    try {
      const currentAdmin = await this.getCurrentAdmin();

      const roleHierarchy: Record<string, number> = {
        admin: 3,
        editor: 2,
        hr: 1,
      };

      return roleHierarchy[currentAdmin.role] >= roleHierarchy[requiredRole];
    } catch {
      return false;
    }
  }

  /**
   * Check if current user has valid admin access without throwing errors
   */
  static async checkAdminAccess(): Promise<boolean> {
    try {
      await this.getCurrentAdmin();
      return true;
    } catch (error) {
      console.error("Admin access check failed:", error);
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
      console.error("Error logging out:", error);
      throw error;
    }
  }
}
