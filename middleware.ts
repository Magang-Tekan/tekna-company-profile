import { createServerClient } from "@supabase/ssr";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Get current path first
  const { pathname } = req.nextUrl;

  // Check auth status using getSession() for middleware
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  const user = session?.user;
  
  // Log for debugging
  console.log('Middleware - Path:', pathname, 'Session Error:', sessionError, 'User:', user ? user.id : 'Not authenticated');

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/sign-up', '/auth/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => route === pathname);

  // Admin routes that require specific roles
  const adminRoutes = ['/dashboard/admin', '/dashboard/newsletter'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Dashboard routes that require authentication
  const dashboardRoutes = ['/dashboard'];
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  // Allow access to public routes
  if (isPublicRoute) {
    console.log('Middleware - Public route, allowing access');
    return res;
  }

  // Check if user is properly authenticated
  const isAuthenticated = user && session && !sessionError;
  
  if (isAdminRoute && !isAuthenticated) {
    console.log('Middleware - Admin route access denied, redirecting to login');
    const response = NextResponse.redirect(new URL('/auth/login', req.url));
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    return response;
  }

  if (isDashboardRoute && !isAuthenticated) {
    console.log('Middleware - Dashboard route access denied, redirecting to login');
    const response = NextResponse.redirect(new URL('/auth/login', req.url));
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    return response;
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && pathname === '/auth/login') {
    console.log('Middleware - Authenticated user accessing login, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is not authenticated and on login page, allow access
  if (pathname === '/auth/login' && !isAuthenticated) {
    console.log('Middleware - Unauthenticated user on login page, allowing access');
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
