import { lookupDomainServer } from "@/lib/api/server-api";
import { redirect } from "next/navigation";

interface LookupPageProps {
  searchParams: Promise<{ domain?: string; path?: string }>;
}

export default async function LookupPage({ searchParams }: LookupPageProps) {
  const { domain, path = "/" } = await searchParams;

  if (!domain) {
    redirect("/");
  }

  const result = await lookupDomainServer(domain);

  if (result) {
    // Redirect to the actual site route
    // Note: In middleware we rewrote to /site/lookup.
    // Now we redirect to /site/[siteId]/[...slug]
    const sitePath = path.startsWith("/") ? path : `/${path}`;
    redirect(`/site/${result.siteId}${sitePath}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl mb-2">Site Not Found</h2>
        <p className="text-gray-400">
          The domain <strong>{domain}</strong> is not associated with any
          published site.
        </p>
        <a
          href="/"
          className="inline-block mt-8 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Builder
        </a>
      </div>
    </div>
  );
}
