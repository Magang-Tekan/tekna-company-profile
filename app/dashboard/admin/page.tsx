"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconUsers, IconShield, IconActivity } from "@tabler/icons-react";
import { AdminAuthService, AdminUser } from "@/lib/services/admin-auth.service";
import { AdminUserModal } from "./admin-user-modal";
import { AdminStats } from "./admin-stats";

export default function AdminManagementPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [canManageUsers, setCanManageUsers] = useState(false);

  useEffect(() => {
    loadAdminUsers();
    checkPermissions();
  }, []);

  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      const users = await AdminAuthService.getAllAdminUsers();
      setAdminUsers(users);
    } catch (error) {
      console.error("Error loading admin users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const canManage = await AdminAuthService.hasPermission("super_admin");
      setCanManageUsers(canManage);
      
      const current = await AdminAuthService.getCurrentAdmin();
      setCurrentUser(current);
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  const handleUserCreated = () => {
    loadAdminUsers();
    setShowUserModal(false);
  };

  const handleUserUpdated = () => {
    loadAdminUsers();
  };

  const handleUserDeactivated = async (userId: string) => {
    try {
      await AdminAuthService.deactivateAdminUser(userId);
      loadAdminUsers();
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "default";
      case "editor":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "editor":
        return "Editor";
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage admin users, roles, and system settings
          </p>
        </div>
        {canManageUsers && (
          <Button onClick={() => setShowUserModal(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Admin User
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <AdminStats adminUsers={adminUsers} />

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Admin Users
          </CardTitle>
          <CardDescription>
            Manage system administrators and content editors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                  
                  <div className="text-sm text-muted-foreground">
                    {user.is_active ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </div>

                  {canManageUsers && user.id !== currentUser?.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement edit user modal
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserDeactivated(user.id)}
                        disabled={!user.is_active}
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {adminUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No admin users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin User Modal */}
      {showUserModal && (
        <AdminUserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSuccess={handleUserCreated}
        />
      )}
    </div>
  );
}
