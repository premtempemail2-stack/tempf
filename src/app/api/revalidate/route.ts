import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// API route for on-demand revalidation
// Called after publishing a site to regenerate the static page

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, secret } = body;

    // Validate secret in production
    // if (secret !== process.env.REVALIDATION_SECRET) {
    //   return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    // }

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID required' }, { status: 400 });
    }

    // Revalidate the site page
    revalidatePath(`/site/${siteId}`);
    
    // Also revalidate any nested pages
    revalidatePath(`/site/${siteId}/(.*)`, 'page');

    return NextResponse.json({
      success: true,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
