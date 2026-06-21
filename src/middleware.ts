import { NextRequest, NextResponse } from "next/server";

// Middleware is minimal - route protection handled in layout/page components
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
