'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getPreview, getPublished } from '@/lib/api';
import { TemplateConfig } from '@/lib/types';
import { renderSections, Navbar, Footer } from '@/components/templates';
import { LoadingScreen } from '@/components/ui';

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const siteId = params.siteId as string;
  const mode = searchParams.get('mode') || 'draft';

  const [content, setContent] = useState<TemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = mode === 'published' 
          ? await getPublished(siteId)
          : await getPreview(siteId);
        setContent(data);
      } catch (error) {
        console.error('Failed to load content:', error);
        // Use mock content for demo
        setContent({
          pages: [
            {
              id: 'home',
              slug: '/',
              title: 'Home',
              sections: [
                { id: 'hero-1', type: 'hero', props: { headline: 'Preview Mode' } },
                { id: 'features-1', type: 'features', props: {} },
              ],
            },
          ],
          navigation: [{ label: 'Home', href: '/' }],
          theme: { color: { primary: '#8b5cf6' } },
          footer: {},
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();

    // Listen for postMessage from editor
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_CONTENT') {
        setContent(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [siteId, mode]);

  if (isLoading || !content) {
    return <LoadingScreen message="Loading preview..." />;
  }

  const currentPage = content.pages?.[0]; // Default to first page

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <Navbar
        logoText="Preview"
        links={content.navigation}
        ctaText=""
      />

      {/* Page Sections */}
      {currentPage && renderSections(currentPage.sections)}

      {/* Footer */}
      <Footer
        logoText="Preview"
        {...(content.footer as Record<string, unknown>)}
      />
    </div>
  );
}
