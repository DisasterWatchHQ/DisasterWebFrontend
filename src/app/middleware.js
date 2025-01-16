// middleware.ts (in project root or app directory)
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

export function middleware(NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Allow access to public routes even without token
  if (publicRoutes.includes(pathname)) {
    // If user is already logged in, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (!token && !publicRoutes.includes(pathname)) {
    // Store the original intended destination
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configure which routes middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - static files (_next/static/*, favicon.ico, etc.)
     * - public files (public/*)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};