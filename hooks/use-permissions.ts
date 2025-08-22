import { useState, useEffect } from 'react';
import { AdminAuthService, AdminUser } from '@/lib/services/admin-auth.service';

export interface PermissionConfig {
  requiredRole: 'super_admin' | 'admin' | 'editor';
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function usePermissions() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await AdminAuthService.getCurrentAdmin();
      setCurrentUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (requiredRole: 'super_admin' | 'admin' | 'editor'): boolean => {
    if (!currentUser) return false;
    
    const roleHierarchy = {
      'super_admin': 3,
      'admin': 2,
      'editor': 1
    };

    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const canManageUsers = (): boolean => {
    return hasPermission('super_admin');
  };

  const canManageSettings = (): boolean => {
    return hasPermission('admin');
  };

  const canManageContent = (): boolean => {
    return hasPermission('editor');
  };

  const canAccessAdminPanel = (): boolean => {
    return hasPermission('super_admin');
  };

  const canAccessNewsletter = (): boolean => {
    return hasPermission('super_admin');
  };

  const refreshUser = () => {
    loadCurrentUser();
  };

  return {
    currentUser,
    isLoading,
    error,
    hasPermission,
    canManageUsers,
    canManageSettings,
    canManageContent,
    canAccessAdminPanel,
    canAccessNewsletter,
    refreshUser
  };
}

// Hook for conditional rendering based on permissions
export function usePermissionGuard(config: PermissionConfig) {
  const { hasPermission, isLoading } = usePermissions();
  const { requiredRole, fallback, redirectTo } = config;

  const hasAccess = hasPermission(requiredRole);

  useEffect(() => {
    if (!isLoading && !hasAccess && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [hasAccess, isLoading, redirectTo]);

  return {
    hasAccess,
    isLoading,
    fallback: fallback || null
  };
}

// Hook for role-based UI rendering
export function useRoleBasedUI() {
  const { currentUser, hasPermission } = usePermissions();

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'super_admin':
        return 'text-destructive';
      case 'admin':
        return 'text-primary';
      case 'editor':
        return 'text-secondary-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return {
    currentUser,
    hasPermission,
    getRoleDisplayName,
    getRoleBadgeVariant,
    getRoleColor
  };
}
