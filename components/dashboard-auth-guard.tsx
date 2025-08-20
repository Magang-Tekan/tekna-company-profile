"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from './session-provider';
import { AdminAuthService } from '@/lib/services/admin-auth.service';

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, session, isLoading: sessionLoading } = useSession();

  useEffect(() => {
    if (sessionLoading) {
      return; // Wait for session to load
    }

    if (user && session) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push('/auth/login');
    }
  }, [user, session, sessionLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
