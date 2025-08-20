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

  // Check auth status using getSession() for middleware (this is correct for middleware)
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const user = session?.user;

  // Admin routes that require specific roles
  const adminRoutes = ['/dashboard/admin', '/dashboard/newsletter'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Dashboard routes that require authentication
  const dashboardRoutes = ['/dashboard'];
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (user && pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname === '/auth/login' && !user) {
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
