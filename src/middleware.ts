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

  // Skip for main application routes
  const appRoutes = [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/editor',
    '/templates',
    '/preview',
  ];
  
  if (appRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Check if this is a subdomain request (e.g., mysite.builder.com)
  const isSubdomain = hostname.endsWith(`.${BUILDER_DOMAIN}`) || 
                      hostname.includes('.') && !hostname.includes('localhost');

  if (isSubdomain) {
    // Extract siteId from subdomain
    const siteId = hostname.split('.')[0];
    
    // Rewrite to the published site route
    const url = request.nextUrl.clone();
    url.pathname = `/site/${siteId}${pathname}`;
    
    return NextResponse.rewrite(url);
  }

  // Check if this is a custom domain (not our builder domain)
  if (!hostname.includes(BUILDER_DOMAIN) && !hostname.includes('localhost')) {
    // This is a custom domain - we need to look up the siteId
    // In production, this would be a database lookup or API call
    // For now, we'll pass the domain as a query param for the site route to handle
    
    const url = request.nextUrl.clone();
    url.pathname = `/site/lookup`;
    url.searchParams.set('domain', hostname);
    url.searchParams.set('path', pathname);
    
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
