"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  Settings2,
  Rocket,
  Loader2,
  Check,
  Undo2,
  AlertTriangle,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  X,
} from "lucide-react";
import { Button, Card, Modal, LoadingScreen } from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { useEditorStore } from "@/lib/store";
import {
  getSite,
  updateDraft,
  publishSite as publishSiteApi,
  updateSiteDomain,
  verifyDomain as verifyDomainApi,
  getDomains as getDomainsApi,
  deleteDomain as deleteDomainApi,
} from "@/lib/api";
import { sectionMeta } from "@/components/templates/registry";
import { Section, Page } from "@/lib/types";
import { PublishSiteResponse, DomainSetupInfo } from "@/lib/types/api";

type CollisionInfo = {
  isOwner: boolean;
  linkedSiteName: string;
  linkedSiteId: string;
  domainId: string;
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const siteIdParam = params.siteId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    siteId,
    siteName,
    content,
    selectedPageId,
    selectedSectionId,
    isDirty,
    isSaving,
    isPublishing,
    previewMode,
    deploymentStatus,
    customDomain: storeDomain,
    domainVerified,
    setSiteData,
    selectPage,
    selectSection,
    addSection,
    updateSection,
    deleteSection,
    setIsSaving,
    setIsPublishing,
    markSaved,
    setPreviewMode,
    setDeploymentStatus,
    setCustomDomain: setStoreDomain,
    reset,
  } = useEditorStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishResult, setPublishResult] =
    useState<PublishSiteResponse | null>(null);

  // Domain flow state
  const [publishStep, setPublishStep] = useState<
    "domain" | "confirm" | "success"
  >("domain");
  const [domainInput, setDomainInput] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [skipDomain, setSkipDomain] = useState(false);

  // Domain settings modal state
  const [domainSettingsInput, setDomainSettingsInput] = useState("");
  const [domainSettingsError, setDomainSettingsError] = useState<string | null>(
    null
  );
  const [domainSettingsLoading, setDomainSettingsLoading] = useState(false);
  const [domainSettingsResult, setDomainSettingsResult] =
    useState<DomainSetupInfo | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [collisionInfo, setCollisionInfo] = useState<CollisionInfo | null>(
    null
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlinkAndReassign, setUnlinkAndReassign] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load site data
  useEffect(() => {
    const loadSite = async () => {
      try {
        const site = await getSite(siteIdParam);
        setSiteData(
          site.siteId,
          site.name,
          site.draftContent,
          site.deploymentStatus,
          site.customDomain,
          site.domainVerified
        );
      } catch (err) {
        console.error("Failed to load site:", err);
        setLoadError(
          err instanceof Error
            ? err.message
            : "Failed to load site. Make sure the backend API is running."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadSite();
    }

    return () => reset();
  }, [siteIdParam, isAuthenticated, setSiteData, reset]);

  // Auto-save
  useEffect(() => {
    if (!isDirty || !content || !siteId) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateDraft(siteId, content);
        markSaved();
      } catch (error) {
        console.error("Failed to save:", error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isDirty, content, siteId, setIsSaving, markSaved]);

  // Update preview iframe
  useEffect(() => {
    if (iframeRef.current && content) {
      iframeRef.current.contentWindow?.postMessage(
        { type: "UPDATE_CONTENT", payload: content },
        "*"
      );
    }
  }, [content]);

  const currentPage = content?.pages.find((p) => p.id === selectedPageId);
  const currentSection = currentPage?.sections.find(
    (s) => s.id === selectedSectionId
  );

  const handleAddSection = (type: string) => {
    if (!selectedPageId) return;

    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      props: {},
    };
    addSection(selectedPageId, newSection);
    selectSection(newSection.id);
    setShowAddSectionModal(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedPageId) return;
    deleteSection(selectedPageId, sectionId);
  };

  const isFirstPublish = deploymentStatus === "draft";

  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

  const handleOpenPublish = () => {
    setPublishError(null);
    setPublishResult(null);
    setDomainInput("");
    setDomainError(null);
    setSkipDomain(false);
    setCopiedToken(false);
    // First publish → domain step; subsequent → confirm directly
    setPublishStep(isFirstPublish ? "domain" : "confirm");
    setShowPublishModal(true);
  };

  const handleDomainNext = () => {
    if (!skipDomain && domainInput) {
      if (!domainRegex.test(domainInput.trim())) {
        setDomainError("Please enter a valid domain (e.g. mydomain.com)");
        return;
      }
    }
    setDomainError(null);
    setPublishStep("confirm");
  };

  const handlePublish = async () => {
    if (!siteId) return;

    setIsPublishing(true);
    setPublishError(null);
    try {
      const options =
        isFirstPublish && domainInput && !skipDomain
          ? { customDomain: domainInput.trim() }
          : undefined;

      const result = await publishSiteApi(siteId, options);
      setPublishResult(result);
      setDeploymentStatus("published");
      if (result.customDomain) {
        setStoreDomain(result.customDomain, result.domainVerified);
      }
      setPublishStep("success");
    } catch (err: any) {
      console.error("Failed to publish:", err);

      const errorData = err.response?.data;
      if (
        errorData?.message === "Domain already registered" &&
        errorData.data
      ) {
        // Switch to domain settings modal or handle it inside publish modal?
        // Let's show it in the publish modal error area or reuse collisionInfo if we can.
        setDomainSettingsInput(domainInput.trim());
        setCollisionInfo(errorData.data);
        setPublishStep("domain"); // Go back to domain step to show error/unlink
      } else {
        setPublishError(
          err instanceof Error
            ? err.message
            : "Failed to publish site. Please try again."
        );
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Domain settings handlers
  const handleOpenDomainSettings = () => {
    setDomainSettingsInput(storeDomain || "");
    setDomainSettingsError(null);
    setDomainSettingsResult(null);
    setDomainSettingsLoading(false);
    setCopiedToken(false);
    setShowDomainModal(true);
  };

  const handleUpdateDomain = async (force: boolean = false) => {
    if (!siteId) return;

    const newDomain = domainSettingsInput.trim() || null;
    if (newDomain && !domainRegex.test(newDomain)) {
      setDomainSettingsError("Please enter a valid domain (e.g. mydomain.com)");
      return;
    }

    setDomainSettingsLoading(true);
    setDomainSettingsError(null);
    setCollisionInfo(null);

    try {
      const result = await updateSiteDomain(siteId, newDomain);
      setStoreDomain(result.customDomain, result.domainVerified);
      if (result.domainSetup) {
        setDomainSettingsResult(result.domainSetup);
      } else {
        setShowDomainModal(false);
      }
    } catch (err: any) {
      console.error("Failed to update domain:", err);

      const errorData = err.response?.data;
      if (
        errorData?.message === "Domain already registered" &&
        errorData.data
      ) {
        setCollisionInfo(errorData.data);
      } else {
        setDomainSettingsError(
          err instanceof Error
            ? err.message
            : "Failed to update domain. Please try again."
        );
      }
    } finally {
      setDomainSettingsLoading(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!siteId) return;

    // We need the domain ID. Since we don't have it directly in the store,
    // we'll find it by fetching domains if not already known,
    // but the backend verify endpoint usually takes the domain ID.
    // Let's assume we can get it from the domain list.

    setIsVerifying(true);
    try {
      const domains = await getDomainsApi();
      const domainRecord = domains.find((d) => d.domain === storeDomain);

      if (!domainRecord) {
        throw new Error("Domain record not found");
      }

      const result = await verifyDomainApi(domainRecord._id);
      setStoreDomain(result.domain, result.verified);
      if (result.verified) {
        // Success!
        setDomainSettingsResult(null); // Clear instructions
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setDomainSettingsError(
        err instanceof Error ? err.message : "Verification failed. Check DNS."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUnlinkAndReassign = async () => {
    if (!collisionInfo || !siteId) return;

    setDomainSettingsLoading(true);
    setDomainSettingsError(null);
    try {
      // 1. Unlink from old site (this usually means deleting the domain record if we want to re-add it)
      await deleteDomainApi(collisionInfo.domainId);

      // 2. Re-assign to current site
      const newDomain = domainSettingsInput.trim();
      const result = await updateSiteDomain(siteId, newDomain);

      setStoreDomain(result.customDomain, result.domainVerified);
      if (result.domainSetup) {
        setDomainSettingsResult(result.domainSetup);
      } else {
        setShowDomainModal(false);
      }
      setCollisionInfo(null);
    } catch (err) {
      console.error("Failed to unlink and reassign:", err);
      setDomainSettingsError(
        err instanceof Error ? err.message : "Unlink failed. Please try again."
      );
    } finally {
      setDomainSettingsLoading(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!siteId) return;
    setDomainSettingsLoading(true);
    setDomainSettingsError(null);
    try {
      await updateSiteDomain(siteId, null);
      setStoreDomain(null, false);
      setShowDomainModal(false);
    } catch (err) {
      console.error("Failed to remove domain:", err);
      setDomainSettingsError(
        err instanceof Error ? err.message : "Failed to remove domain."
      );
    } finally {
      setDomainSettingsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSectionPropChange = useCallback(
    (prop: string, value: unknown) => {
      if (!selectedPageId || !selectedSectionId) return;
      updateSection(selectedPageId, selectedSectionId, { [prop]: value });
    },
    [selectedPageId, selectedSectionId, updateSection]
  );

  if (authLoading || isLoading) {
    return <LoadingScreen message="Loading editor..." />;
  }

  if (loadError || !content) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Failed to Load Site
          </h1>
          <p className="text-gray-400 mb-6">
            {loadError || "Could not load site data."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const previewWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Top Bar */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-white/10 bg-gray-900">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <h1 className="text-sm font-medium text-white">{siteName}</h1>
          {isDirty && (
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Unsaved changes
            </span>
          )}
          {isSaving && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          )}
        </div>

        {/* Center - Device Preview */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`p-2 rounded ${
              previewMode === "desktop"
                ? "bg-violet-500/20 text-violet-300"
                : "text-gray-400 hover:text-white"
            }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode("tablet")}
            className={`p-2 rounded ${
              previewMode === "tablet"
                ? "bg-violet-500/20 text-violet-300"
                : "text-gray-400 hover:text-white"
            }`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`p-2 rounded ${
              previewMode === "mobile"
                ? "bg-violet-500/20 text-violet-300"
                : "text-gray-400 hover:text-white"
            }`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <a
              href={`/preview/${siteId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button size="sm" onClick={handleOpenPublish}>
            <Rocket className="w-4 h-4 mr-2" />
            Publish
          </Button>
          {deploymentStatus === "published" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenDomainSettings}
              title="Domain settings"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Page & Section List */}
        <aside className="w-64 border-r border-white/10 bg-gray-900 flex flex-col overflow-hidden">
          {/* Pages */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Pages
              </h3>
            </div>
            <div className="space-y-1">
              {content?.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => selectPage(page.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    selectedPageId === page.id
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {page.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sections
              </h3>
              <button
                onClick={() => setShowAddSectionModal(true)}
                className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {currentPage?.sections.map((section, index) => (
                <div
                  key={section.id}
                  onClick={() => selectSection(section.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    selectedSectionId === section.id
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
                  <span className="flex-1 text-sm capitalize truncate">
                    {section.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {(!currentPage?.sections ||
                currentPage.sections.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No sections yet
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-gray-800 p-4 overflow-hidden flex items-center justify-center">
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: previewWidths[previewMode],
              maxWidth: "100%",
              height: "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`/preview/${siteId}?mode=draft`}
              className="w-full h-full border-0"
              title="Site Preview"
            />
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 border-l border-white/10 bg-gray-900 overflow-y-auto">
          {selectedSectionId && currentSection ? (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-violet-400" />
                <h3 className="font-medium text-white capitalize">
                  {currentSection.type}
                </h3>
              </div>

              {/* Dynamic props editor based on section type */}
              <div className="space-y-4">
                {currentSection.type === "hero" && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={(currentSection.props.headline as string) || ""}
                        onChange={(e) =>
                          handleSectionPropChange("headline", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Subheadline
                      </label>
                      <input
                        type="text"
                        value={
                          (currentSection.props.subheadline as string) || ""
                        }
                        onChange={(e) =>
                          handleSectionPropChange("subheadline", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={
                          (currentSection.props.description as string) || ""
                        }
                        onChange={(e) =>
                          handleSectionPropChange("description", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Primary Button
                      </label>
                      <input
                        type="text"
                        value={
                          (currentSection.props.primaryButtonText as string) ||
                          ""
                        }
                        onChange={(e) =>
                          handleSectionPropChange(
                            "primaryButtonText",
                            e.target.value
                          )
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Button text"
                      />
                    </div>
                  </>
                )}

                {currentSection.type === "cta" && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={(currentSection.props.title as string) || ""}
                        onChange={(e) =>
                          handleSectionPropChange("title", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={
                          (currentSection.props.description as string) || ""
                        }
                        onChange={(e) =>
                          handleSectionPropChange("description", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Generic JSON editor for other types */}
                {!["hero", "cta"].includes(currentSection.type) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Props (JSON)
                    </label>
                    <textarea
                      rows={10}
                      value={JSON.stringify(currentSection.props, null, 2)}
                      onChange={(e) => {
                        try {
                          const props = JSON.parse(e.target.value);
                          if (selectedPageId && selectedSectionId) {
                            updateSection(
                              selectedPageId,
                              selectedSectionId,
                              props
                            );
                          }
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">Select a section to edit its properties</p>
            </div>
          )}
        </aside>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        title="Add Section"
        size="lg"
      >
        <div className="grid gap-3 md:grid-cols-2 max-h-96 overflow-y-auto">
          {sectionMeta.map((meta) => (
            <button
              key={meta.type}
              onClick={() => handleAddSection(meta.type)}
              className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">{meta.label}</h4>
                <p className="text-sm text-gray-400">{meta.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Publish Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => !isPublishing && setShowPublishModal(false)}
        title={
          publishStep === "domain"
            ? "Connect Your Domain"
            : publishStep === "success"
            ? "Published!"
            : "Publish Your Site"
        }
        size="md"
      >
        {publishStep === "domain" && (
          <div>
            <p className="text-gray-300 mb-4">
              Connect a custom domain to your site, or use the default builder
              subdomain.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Custom Domain
                </label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => {
                    setDomainInput(e.target.value);
                    setDomainError(null);
                    setSkipDomain(false);
                  }}
                  disabled={skipDomain}
                  placeholder="mydomain.com"
                  className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    domainError ? "border-red-500/50" : "border-white/10"
                  } ${skipDomain ? "opacity-50" : ""}`}
                />
                {domainError && (
                  <p className="text-red-400 text-xs mt-1.5">{domainError}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSkipDomain(!skipDomain);
                    if (!skipDomain) {
                      setDomainInput("");
                      setDomainError(null);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                    skipDomain
                      ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                      : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {skipDomain && <Check className="w-3.5 h-3.5" />}
                  Use default subdomain
                </button>
              </div>

              {skipDomain && siteId && (
                <p className="text-sm text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
                  Your site will be available at{" "}
                  <span className="text-violet-300 font-mono text-xs">
                    {siteId}.
                    {process.env.NEXT_PUBLIC_BUILDER_DOMAIN || "builder.com"}
                  </span>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={() => setShowPublishModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDomainNext}
                disabled={!skipDomain && !domainInput.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {publishStep === "confirm" && (
          <>
            <p className="text-gray-300 mb-4">
              This will publish all your changes and make them live on your
              website.
            </p>

            {isFirstPublish && domainInput && !skipDomain && (
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-400">
                  Custom domain:{" "}
                  <span className="text-white font-medium">
                    {domainInput.trim()}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You'll need to configure DNS after publishing
                </p>
              </div>
            )}

            {publishError && (
              <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                {publishError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  if (isFirstPublish) {
                    setPublishStep("domain");
                  } else {
                    setShowPublishModal(false);
                  }
                }}
                disabled={isPublishing}
              >
                {isFirstPublish ? "Back" : "Cancel"}
              </Button>
              <Button onClick={handlePublish} isLoading={isPublishing}>
                <Rocket className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
            </div>
          </>
        )}

        {publishStep === "success" && publishResult && (
          <div className="py-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Your site is live!
              </h3>
              <a
                href={publishResult.publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm transition-colors"
              >
                {publishResult.publishedUrl}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* DNS instructions when custom domain was set */}
            {publishResult.domainSetup && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-amber-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  DNS Configuration Required
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  Add these records to your domain's DNS settings:
                </p>

                <div className="space-y-3">
                  {/* TXT Record */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">TXT Record</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-violet-300 font-mono break-all">
                        {publishResult.domainSetup.verificationToken}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            publishResult.domainSetup!.verificationToken
                          )
                        }
                        className="ml-2 p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        title="Copy token"
                      >
                        {copiedToken ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CNAME Record */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">CNAME Record</p>
                    <code className="text-xs text-violet-300 font-mono">
                      {publishResult.customDomain} → {siteId}.
                      {process.env.NEXT_PUBLIC_BUILDER_DOMAIN || "builder.com"}
                    </code>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  DNS changes may take up to 48 hours to propagate. You can
                  verify your domain later from domain settings.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setShowPublishModal(false)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Domain Settings Modal */}
      <Modal
        isOpen={showDomainModal}
        onClose={() => !domainSettingsLoading && setShowDomainModal(false)}
        title="Domain Settings"
        size="md"
      >
        {collisionInfo ? (
          <div className="py-2">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-300 mb-1">
                    Domain Already Linked
                  </h4>
                  <p className="text-sm text-gray-400">
                    The domain{" "}
                    <span className="text-white font-medium">
                      {domainSettingsInput}
                    </span>{" "}
                    is currently linked to your site{" "}
                    <span className="text-white font-medium">
                      "{collisionInfo.linkedSiteName}"
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              Would you like to unlink it from{" "}
              <span className="italic">"{collisionInfo.linkedSiteName}"</span>{" "}
              and use it for <span className="font-medium">"{siteName}"</span>?
              This will disable the domain on the other site immediately.
            </p>

            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <Rocket className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Site</p>
                  <p className="text-sm font-medium text-white">{siteName}</p>
                </div>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <Check className="w-5 h-5 text-green-400" />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setCollisionInfo(null)}
                disabled={domainSettingsLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnlinkAndReassign}
                isLoading={domainSettingsLoading}
                className="bg-amber-600 hover:bg-amber-500 text-white border-none"
              >
                Unlink and Use Here
              </Button>
            </div>
          </div>
        ) : domainSettingsResult ? (
          <div>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-white font-medium">
                Domain Successfully Added
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Next: Configure your DNS to go live
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-amber-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                DNS Configuration Required
              </h4>
              <div className="space-y-3">
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    TXT Record (Ownership Verification)
                  </p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-violet-300 font-mono break-all">
                      {domainSettingsResult.verificationToken}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(domainSettingsResult.verificationToken)
                      }
                      className="ml-2 p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      {copiedToken ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    CNAME Record (Routing Traffic)
                  </p>
                  <code className="text-xs text-violet-300 font-mono">
                    {domainSettingsInput || storeDomain} → {siteId}.
                    {process.env.NEXT_PUBLIC_BUILDER_DOMAIN || "builder.com"}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDomainModal(false)}>
                Setup Later
              </Button>
              <Button onClick={handleVerifyDomain} isLoading={isVerifying}>
                Verify DNS Now
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {storeDomain && (
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">
                      Current domain:{" "}
                      <span className="text-white font-medium">
                        {storeDomain}
                      </span>
                    </p>
                    <p className="text-xs mt-1">
                      {domainVerified ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified & Live
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Pending
                          Verification
                        </span>
                      )}
                    </p>
                  </div>
                  {!domainVerified && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      onClick={handleVerifyDomain}
                      isLoading={isVerifying}
                    >
                      Verify Now
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {storeDomain ? "Update Domain" : "Custom Domain"}
              </label>
              <input
                type="text"
                value={domainSettingsInput}
                onChange={(e) => {
                  setDomainSettingsInput(e.target.value);
                  setDomainSettingsError(null);
                }}
                placeholder="mydomain.com"
                className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                  domainSettingsError ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {domainSettingsError && (
                <p className="text-red-400 text-xs mt-1.5">
                  {domainSettingsError}
                </p>
              )}
            </div>

            <div className="flex justify-between gap-3">
              <div>
                {storeDomain && (
                  <Button
                    variant="ghost"
                    onClick={handleRemoveDomain}
                    disabled={domainSettingsLoading}
                    className="text-red-400 hover:text-red-300 px-0"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDomainModal(false)}
                  disabled={domainSettingsLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateDomain()}
                  isLoading={domainSettingsLoading}
                  disabled={
                    !domainSettingsInput.trim() ||
                    domainSettingsInput === storeDomain
                  }
                >
                  {storeDomain ? "Update" : "Add Domain"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
