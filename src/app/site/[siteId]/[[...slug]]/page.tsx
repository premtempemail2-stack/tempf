import { getPublished } from "@/lib/api";
import { TemplateConfig } from "@/lib/types";
import { Navbar, Footer } from "@/components/templates";
import SectionRenderer from "@/components/templates/SectionRenderer";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ siteId: string; slug?: string[] }>;
}

// This route handles published sites with SSG/ISR
// Can be statically generated or regenerated on-demand

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata from site content
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { siteId } = await params;

  try {
    // In production, fetch site metadata
    // const site = await getSite(siteId);
    return {
      title: `${siteId} - Built with WebBuilder`,
      description: "Website created with WebBuilder",
    };
  } catch {
    return {
      title: "Website",
      description: "Built with WebBuilder",
    };
  }
}

async function getContent(siteId: string): Promise<TemplateConfig | null> {
  try {
    return await getPublished(siteId);
  } catch {
    // Return demo content
    return {
      pages: [
        {
          id: "home",
          slug: "/",
          title: "Home",
          sections: [
            {
              id: "hero-1",
              type: "hero",
              props: {
                headline: "Welcome to This Website",
                subheadline: "Published Site",
                description:
                  "This is a published website created with WebBuilder.",
              },
            },
            { id: "features-1", type: "features", props: {} },
            { id: "cta-1", type: "cta", props: {} },
          ],
        },
      ],
      navigation: [{ label: "Home", href: "/" }],
      theme: { color: { primary: "#8b5cf6" } },
      footer: {},
    };
  }
}

export default async function PublishedSitePage({ params }: PageProps) {
  const { siteId, slug } = await params;
  const content = await getContent(siteId);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Site Not Found</h1>
          <p className="text-gray-400">
            This site doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
        </div>
      </div>
    );
  }

  // Find the correct page based on slug
  const currentPath = slug ? `/${slug.join("/")}` : "/";
  const currentPage =
    content.pages.find((p) => p.slug === currentPath) || content.pages[0];

  if (!currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <Navbar logoText="Website" links={content.navigation} ctaText="" />

      {/* Page Sections */}
      <SectionRenderer sections={currentPage.sections} />

      {/* Footer */}
      <Footer
        logoText="Website"
        {...(content.footer as Record<string, unknown>)}
      />
    </div>
  );
}
