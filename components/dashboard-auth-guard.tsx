"use client";

import React from "react";
import { useSession } from "./session-provider";
import { useAdminAuth } from "@/hooks/use-admin-auth";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

export function DashboardAuthGuard({ children }: Readonly<DashboardAuthGuardProps>) {
  const { user, session, isLoading: sessionLoading } = useSession();
  const { adminUser, isLoading: adminLoading, isAuthenticated } = useAdminAuth();

  // Show loading while session or admin is loading
  if (sessionLoading || adminLoading) {
    return (
      <div className="flex flex-1 w-full items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">
            {adminLoading ? "Verifying admin access..." : "Loading session..."}
          </p>
        </div>
      </div>
    );
  }

  // If no session or not authenticated as admin, don't render children
  // The useAdminAuth hook will handle the redirect automatically
  if (!user || !session || !isAuthenticated || !adminUser) {
    return (
      <div className="flex flex-1 w-full items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has admin access, render dashboard
  return <>{children}</>;
}
