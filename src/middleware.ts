import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for handling custom domain routing
// Maps custom domains to site IDs and rewrites to the published site route

const BUILDER_DOMAIN = process.env.NEXT_PUBLIC_BUILDER_DOMAIN || 'localhost:3000';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, api routes, and internal Next.js routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // --- Subdomain & custom domain checks FIRST (before app routes) ---

  // Extract the hostname without port
  const hostnameWithoutPort = hostname.split(':')[0];
  const builderHostWithoutPort = BUILDER_DOMAIN.split(':')[0];

  // Check if this is a subdomain request (e.g., mysite.localhost:3000 or mysite.builder.com)
  const isSubdomain = hostnameWithoutPort !== builderHostWithoutPort &&
                      hostnameWithoutPort.endsWith(`.${builderHostWithoutPort}`);

  if (isSubdomain) {
    // Extract siteId from subdomain (everything before the builder domain)
    const siteId = hostnameWithoutPort.replace(`.${builderHostWithoutPort}`, '');
    
    // Rewrite to the published site route
    const url = request.nextUrl.clone();
    url.pathname = `/site/${siteId}${pathname}`;
    
    return NextResponse.rewrite(url);
  }

  // Check if this is a custom domain (not our builder domain at all)
  if (hostnameWithoutPort !== builderHostWithoutPort && 
      !hostnameWithoutPort.endsWith(`.${builderHostWithoutPort}`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/site/lookup`;
    url.searchParams.set('domain', hostname);
    url.searchParams.set('path', pathname);
    
    return NextResponse.rewrite(url);
  }

  // --- Main app routes (only reached for the builder domain itself) ---

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
