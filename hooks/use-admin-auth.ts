"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminAuthService, type AdminUser } from "@/lib/services/admin-auth.service";

interface UseAdminAuthReturn {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await AdminAuthService.logout();
      setAdminUser(null);
      setError(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force redirect even if logout fails
      router.push("/auth/login");
    }
  }, [router]);

  const refreshAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await AdminAuthService.getCurrentAdmin();
      setAdminUser(user);
    } catch (error) {
      console.error("Admin authentication failed:", error);
      setError(error instanceof Error ? error.message : "Authentication failed");
      setAdminUser(null);
      
      // Auto-logout on authentication failure
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  return {
    adminUser,
    isLoading,
    isAuthenticated: !!adminUser,
    error,
    logout,
    refreshAdmin,
  };
}
