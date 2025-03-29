import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/"];

export function middleware(request) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Force HTTPS in production
  if (process.env.NEXT_PRIVATE_ENABLE_HTTPS === 'true' && !request.nextUrl.protocol.includes('https')) {
    return NextResponse.redirect(`https://${request.nextUrl.host}${request.nextUrl.pathname}`);
  }

  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!token && !publicRoutes.includes(pathname)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - static files (_next/static/*, favicon.ico, etc.)
     * - public files (public/*)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
