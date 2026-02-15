"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Layers } from "lucide-react";
import { Button, Card, LoadingScreen } from "@/components/ui";
import { getTemplate } from "@/lib/api";
import { Template, Page } from "@/lib/types";
import { renderSections, Navbar, Footer } from "@/components/templates";
import { useAuth } from "@/lib/hooks";

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getTemplate(templateId);
        setTemplate(data);
      } catch (err) {
        console.error("Failed to fetch template:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load template. Make sure the backend API is running."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  const handleUseTemplate = () => {
    if (isAuthenticated) {
      router.push(`/dashboard?clone=${templateId}`);
    } else {
      router.push(`/register?template=${templateId}`);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading template..." />;
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-white mb-2">
            Template Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "The template you're looking for doesn't exist."}
          </p>
          <Link href="/">
            <Button>Back to Templates</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const pages = template.config.pages || [];
  const currentPage: Page | undefined = pages[currentPageIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Preview Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left - Back & Template Info */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <h1 className="text-sm font-medium text-white">
                {template.name}
              </h1>
              <p className="text-xs text-gray-400">v{template.version}</p>
            </div>
          </div>

          {/* Center - Page Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setCurrentPageIndex(index)}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  index === currentPageIndex
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              {currentPage?.sections.length || 0} sections
            </span>
            <Button onClick={handleUseTemplate}>
              Use This Template
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Mobile Page Selector */}
        <div className="md:hidden px-6 pb-3">
          <select
            value={currentPageIndex}
            onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            {pages.map((page, index) => (
              <option key={page.id} value={index} className="bg-gray-900">
                {page.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Preview Content */}
      <main className="flex-1 pt-24 md:pt-16">
        {currentPage && renderSections(currentPage.sections)}
      </main>

      {/* Floating Use Template Button (Mobile) */}
      <div className="fixed bottom-6 left-6 right-6 md:hidden">
        <Button onClick={handleUseTemplate} className="w-full shadow-2xl">
          Use This Template
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
