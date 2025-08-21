"use client";

import React, { useEffect } from 'react';
import { useSession } from './session-provider';

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const { user, session, isLoading: sessionLoading } = useSession();

  // Show loading while session is loading
  if (sessionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  // If no user or session, redirect to login
  if (!user || !session) {
    // Use useEffect to avoid hydration issues
    useEffect(() => {
      window.location.href = '/auth/login';
    }, []);
    return null;
  }

  // User is authenticated, render dashboard
  return <>{children}</>;
}