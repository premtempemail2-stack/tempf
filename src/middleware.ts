import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for handling custom domain routing
// Maps custom domains to site IDs and rewrites to the published site route

const BUILDER_DOMAIN = process.env.NEXT_PUBLIC_BUILDER_DOMAIN || 'localhost:3000';
const EC2_PUBLIC_IP = process.env.NEXT_PUBLIC_EC2_PUBLIC_IP || '';

export async function middleware(request: NextRequest) {
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
  const host = hostname.split(':')[0].toLowerCase();
  const builderHost = BUILDER_DOMAIN.split(':')[0].toLowerCase();

  // Normalize by removing 'www.' prefix for comparison
  const normalizedHost = host.startsWith('www.') ? host.slice(4) : host;
  const normalizedBuilderHost = builderHost.startsWith('www.') ? builderHost.slice(4) : builderHost;

  // 1. Check if this is the main builder domain or the EC2 IP
  if (normalizedHost === normalizedBuilderHost || (EC2_PUBLIC_IP && normalizedHost === EC2_PUBLIC_IP.toLowerCase())) {
    return NextResponse.next();
  }

  // 2. Check if this is a subdomain request (e.g., mysite.localhost:3000 or mysite.builder.com)
  const isSubdomain = normalizedHost.endsWith(`.${normalizedBuilderHost}`);

  if (isSubdomain) {
    // Extract siteId from subdomain (everything before the builder domain)
    const siteId = normalizedHost.replace(`.${normalizedBuilderHost}`, '');
    
    // Rewrite to the published site route
    const url = request.nextUrl.clone();
    url.pathname = `/site/${siteId}${pathname}`;
    
    return NextResponse.rewrite(url);
  }

  // 3. This must be a custom domain (not our builder domain and not our EC2 IP)
  try {
    // Call the lookup API directly from middleware
    const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    const res = await fetch(`${API_URL}/public/domains/lookup/${host}`, {
      next: { revalidate: 300 } // Cache the fetch result if possible
    });

    if (res.ok) {
      const json = await res.json();
      const siteId = json.data.siteId;
      
      const url = request.nextUrl.clone();
      url.pathname = `/site/${siteId}${pathname}`;
      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error('Middleware domain lookup error:', error);
  }

  // Fallback to the lookup page if API fails or site not found
  const url = request.nextUrl.clone();
  url.pathname = `/site/lookup`;
  url.searchParams.set('domain', host);
  url.searchParams.set('path', pathname);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
