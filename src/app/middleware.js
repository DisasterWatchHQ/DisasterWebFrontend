import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

export function middleware(NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!token && !publicRoutes.includes(pathname)) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
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
