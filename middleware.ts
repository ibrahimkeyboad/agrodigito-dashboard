import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define routes that require authentication
  // We want to protect anything starting with /dashboard
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // 2. Define routes that are for guests only (like login)
  const isAuthRoute = pathname.startsWith('/login');

  // 3. Get the session cookie
  // Note: We only check for PRESENCE here. The server verifies validity.
  const session = request.cookies.get('__session')?.value;

  // 🛑 SCENARIO 1: User tries to access Dashboard without login
  if (isProtectedRoute && !session) {
    // Redirect them to login page
    const loginUrl = new URL('/login', request.url);
    // Optional: Add where they were trying to go so you can redirect back later
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🛑 SCENARIO 2: User is already logged in but tries to visit Login page
  if (isAuthRoute && session) {
    // Redirect them straight to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ SCENARIO 3: Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, svgs, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
