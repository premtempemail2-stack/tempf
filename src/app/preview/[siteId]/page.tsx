"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getPreview, getPublished } from "@/lib/api";
import { TemplateConfig } from "@/lib/types";
import { renderSections, Navbar, Footer } from "@/components/templates";
import { LoadingScreen } from "@/components/ui";

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const siteId = params.siteId as string;
  const mode = searchParams.get("mode") || "draft";

  const [content, setContent] = useState<TemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setError(null);
      try {
        const data =
          mode === "published"
            ? await getPublished(siteId)
            : await getPreview(siteId);
        setContent(data);
      } catch (err) {
        console.error("Failed to load content:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load site content. Make sure the backend API is running."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();

    // Listen for postMessage from editor
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_CONTENT") {
        setContent(event.data.payload);
        setError(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [siteId, mode]);

  if (isLoading) {
    return <LoadingScreen message="Loading preview..." />;
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Preview Unavailable
          </h1>
          <p className="text-gray-400 mb-6">
            {error || "Could not load site content."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentPage = content.pages?.[0]; // Default to first page

  return (
    <div className="min-h-screen bg-gray-950">
      {currentPage && renderSections(currentPage.sections)}
    </div>
  );
}
