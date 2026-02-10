// Template and Site TypeScript types matching backend models

// Section within a page
export interface Section {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

// SEO configuration for a page
export interface PageSeo {
  description?: string;
  ogImage?: string;
}

// Dynamic page configuration
export interface DynamicConfig {
  collectionType?: string;
  itemTemplate?: Record<string, unknown>;
  listTemplate?: Record<string, unknown>;
}

// Page structure
export interface Page {
  id: string;
  slug: string;
  title: string;
  seo?: PageSeo;
  sections: Section[];
  isDynamic?: boolean;
  dynamicConfig?: DynamicConfig;
}

// Navigation item
export interface NavItem {
  label: string;
  href: string;
}

// Theme colors
export interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

// Theme configuration
export interface Theme {
  color?: ThemeColors;
  font?: string;
  fontSize?: {
    base?: string;
    heading?: string;
  };
  fontWeight?: {
    normal?: number;
    bold?: number;
  };
}

// Template configuration
export interface TemplateConfig {
  pages: Page[];
  theme?: Theme;
  navigation?: NavItem[];
  footer?: Record<string, unknown>;
}

// Changelog entry
export interface ChangelogEntry {
  type: "added" | "removed" | "modified" | "fixed";
  description: string;
  path?: string;
}

// Version changelog
export interface VersionChangelog {
  version: string;
  date: string;
  changes: ChangelogEntry[];
}

// Template model
export interface Template {
  _id: string;
  name: string;
  version: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  config: TemplateConfig;
  isActive: boolean;
  changelog?: VersionChangelog[];
  createdAt: string;
  updatedAt: string;
}

// Site metadata
export interface SiteMetadata {
  seoTitle?: string;
  seoDescription?: string;
  favicon?: string;
  socialImage?: string;
  analytics?: {
    googleAnalyticsId?: string;
  };
}

// Dynamic content item
export interface DynamicContentItem {
  id: string;
  slug: string;
  title?: string;
  content?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  publishedAt?: string;
  isPublished: boolean;
}

// Dynamic content collection
export interface DynamicCollection {
  type: string;
  items: DynamicContentItem[];
}

// Available upgrade info
export interface AvailableUpgrade {
  version: string;
  changes: Array<
    ChangelogEntry & {
      requiresAction?: boolean;
      actionDescription?: string;
    }
  >;
}

// User site model
export interface UserSite {
  _id: string;
  userId: string;
  templateId: string;
  templateVersion: string;
  siteId: string;
  name: string;
  draftContent: TemplateConfig;
  publishedContent: TemplateConfig | null;
  draftDynamicContent?: DynamicCollection[];
  publishedDynamicContent?: DynamicCollection[];
  deploymentStatus: "draft" | "published" | "updating" | "failed";
  metadata?: SiteMetadata;
  customDomain?: string;
  domainVerified: boolean;
  availableUpgrade?: AvailableUpgrade;
  publishedAt?: string;
  lastUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Domain model
export interface Domain {
  _id: string;
  domain: string;
  siteId: string;
  userId: string;
  verificationToken: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

// User model
export interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
