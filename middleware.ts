import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/login');

  // Get session presence (Middleware cannot verify signature, only presence)
  const session = request.cookies.get('__session')?.value;

  // 🛑 SCENARIO 1: Protected Route + No Session -> Go to Login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    // Add the 'redirect' param so we can send them back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🛑 SCENARIO 2: Login Page + Active Session -> Go to Dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ SCENARIO 3: Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /static (inside /public)
     * 4. all root files (e.g. /favicon.ico)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};