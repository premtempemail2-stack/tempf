/**
 * Server-safe API functions using native fetch().
 * These can be safely used in Next.js Server Components (no js-cookie, no window).
 */

import { TemplateConfig } from '../types';
import { ApiResponse } from '../types/api';

// Base URL without /api suffix, since public routes use /public prefix
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

/**
 * Get published content for a site (server-safe).
 * Backend route: GET /public/sites/:siteId
 */
export async function getPublishedServer(siteId: string): Promise<TemplateConfig> {
  const res = await fetch(`${BASE_URL}/public/sites/${siteId}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch published content: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  // Backend returns { success, data: { siteId, name, content, dynamicContent, metadata } }
  return json.data.content;
}

/**
 * Get preview (draft) content for a site (server-safe).
 * Backend route: GET /api/sites/:siteId/preview (auth-protected)
 */
export async function getPreviewServer(siteId: string): Promise<TemplateConfig> {
  const res = await fetch(`${BASE_URL}/api/sites/${siteId}/preview`, {
    cache: 'no-store', // Always fetch fresh for preview
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch preview content: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  // Backend returns { success, data: { siteId, name, content, dynamicContent, metadata } }
  return json.data.content;
}

/**
 * Lookup siteId by custom domain (server-safe).
 * Backend route: GET /public/domains/lookup/:domain
 */
export async function lookupDomainServer(domain: string): Promise<{ siteId: string; domain: string } | null> {
  try {
    const res = await fetch(`${BASE_URL}/public/domains/lookup/${domain}`, {
      next: { revalidate: 300 }, // Cache lookup for 5 minutes
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to lookup domain: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error looking up domain "${domain}":`, error);
    return null;
  }
}
