"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Plus,
  ExternalLink,
  Settings,
  Globe,
  MoreVertical,
  ArrowUpRight,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button, Card, LoadingScreen, Modal } from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { getSites, createSite, getTemplates } from "@/lib/api";
import { UserSite, Template } from "@/lib/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();

  const [sites, setSites] = useState<UserSite[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle clone from template page
  useEffect(() => {
    const cloneTemplateId = searchParams.get("clone");
    if (cloneTemplateId && isAuthenticated) {
      setSelectedTemplate(cloneTemplateId);
      setShowNewSiteModal(true);
    }
  }, [searchParams, isAuthenticated]);

  // Fetch sites and templates
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const [sitesData, templatesData] = await Promise.all([
          getSites(),
          getTemplates(),
        ]);
        setSites(sitesData);
        setTemplates(templatesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setFetchError(
          err instanceof Error
            ? err.message
            : "Failed to load data. Make sure the backend API is running."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleCreateSite = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    setCreateError(null);
    try {
      const newSite = await createSite({ templateId: selectedTemplate });
      router.push(`/editor/${newSite.siteId}`);
    } catch (err) {
      console.error("Failed to create site:", err);
      setCreateError(
        err instanceof Error
          ? err.message
          : "Failed to create site. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <Sparkles className="w-6 h-6 text-violet-400" />
            WebBuilder
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-violet-500/10 text-violet-300"
            >
              <Globe className="w-5 h-5" />
              My Sites
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
              <span className="text-violet-400 text-sm font-medium">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Sites</h1>
            <p className="text-gray-400 mt-1">Manage and edit your websites</p>
          </div>
          <Button onClick={() => setShowNewSiteModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Site
          </Button>
        </div>

        {/* Sites Grid */}
        {isLoading ? (
          <LoadingScreen message="Loading your sites..." />
        ) : fetchError ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Failed to Load
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">{fetchError}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        ) : sites.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No sites yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Create your first website by choosing a template
            </p>
            <Button onClick={() => setShowNewSiteModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Site
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <Card key={site._id} hover className="overflow-hidden group">
                {/* Preview Image */}
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <Globe className="w-12 h-12" />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link href={`/editor/${site.siteId}`}>
                      <Button size="sm">Edit</Button>
                    </Link>
                    {site.deploymentStatus === "published" && (
                      <a
                        href={`https://${
                          site.customDomain ||
                          `${site.siteId}.${process.env.NEXT_PUBLIC_BUILDER_DOMAIN}`
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="secondary">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{site.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        Updated {new Date(site.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        site.deploymentStatus === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {site.deploymentStatus === "published"
                        ? "Published"
                        : "Draft"}
                    </span>
                    {site.customDomain && site.domainVerified && (
                      <span className="text-xs text-gray-500">
                        {site.customDomain}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {/* Add New Site Card */}
            <Card
              hover
              onClick={() => setShowNewSiteModal(true)}
              className="aspect-[4/3] flex flex-col items-center justify-center cursor-pointer border-dashed"
            >
              <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-gray-400">Create New Site</p>
            </Card>
          </div>
        )}
      </main>

      {/* New Site Modal */}
      <Modal
        isOpen={showNewSiteModal}
        onClose={() => {
          setShowNewSiteModal(false);
          setSelectedTemplate(null);
        }}
        title="Choose a Template"
        size="xl"
      >
        <div className="grid gap-4 md:grid-cols-2 max-h-96 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template._id}
              onClick={() => setSelectedTemplate(template._id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTemplate === template._id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="aspect-video rounded-lg bg-gray-800 mb-3 overflow-hidden">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Globe className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-white">{template.name}</h4>
              <p className="text-sm text-gray-400 capitalize">
                {template.category}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => setShowNewSiteModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateSite}
            disabled={!selectedTemplate}
            isLoading={isCreating}
          >
            Create Site
          </Button>
        </div>
        {createError && (
          <p className="text-red-400 text-sm mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            {createError}
          </p>
        )}
      </Modal>
    </div>
  );
}
