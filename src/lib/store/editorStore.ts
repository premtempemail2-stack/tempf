import { create } from 'zustand';
import { TemplateConfig, Page, Section, Theme, NavItem } from '../types';

interface EditorState {
  // Site data
  siteId: string | null;
  siteName: string;
  content: TemplateConfig | null;
  originalContent: TemplateConfig | null;
  deploymentStatus: 'draft' | 'published' | 'updating' | 'failed';
  customDomain: string | null;
  domainVerified: boolean;
  
  // Editor state
  selectedPageId: string | null;
  selectedSectionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  
  // Preview mode
  previewMode: 'desktop' | 'tablet' | 'mobile';
  
  // Actions
  setSiteData: (siteId: string, name: string, content: TemplateConfig, deploymentStatus?: string, customDomain?: string | null, domainVerified?: boolean) => void;
  setContent: (content: TemplateConfig) => void;
  selectPage: (pageId: string | null) => void;
  selectSection: (sectionId: string | null) => void;
  
  // Page actions
  addPage: (page: Page) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  
  // Section actions
  addSection: (pageId: string, section: Section, index?: number) => void;
  updateSection: (pageId: string, sectionId: string, props: Record<string, unknown>) => void;
  deleteSection: (pageId: string, sectionId: string) => void;
  reorderSections: (pageId: string, fromIndex: number, toIndex: number) => void;
  
  // Theme actions
  updateTheme: (theme: Partial<Theme>) => void;
  
  // Navigation actions
  updateNavigation: (navigation: NavItem[]) => void;
  
  // Status actions
  setIsSaving: (isSaving: boolean) => void;
  setIsPublishing: (isPublishing: boolean) => void;
  markSaved: () => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setDeploymentStatus: (status: 'draft' | 'published' | 'updating' | 'failed') => void;
  setCustomDomain: (domain: string | null, verified?: boolean) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  siteId: null,
  siteName: '',
  content: null,
  originalContent: null,
  deploymentStatus: 'draft' as const,
  customDomain: null as string | null,
  domainVerified: false,
  selectedPageId: null,
  selectedSectionId: null,
  isDirty: false,
  isSaving: false,
  isPublishing: false,
  previewMode: 'desktop' as const,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,

  setSiteData: (siteId, name, content, deploymentStatus, customDomain, domainVerified) => {
    set({
      siteId,
      siteName: name,
      content,
      originalContent: JSON.parse(JSON.stringify(content)),
      deploymentStatus: (deploymentStatus as EditorState['deploymentStatus']) || 'draft',
      customDomain: customDomain || null,
      domainVerified: domainVerified || false,
      selectedPageId: content.pages?.[0]?.id || null,
      isDirty: false,
    });
  },

  setContent: (content) => {
    set({ content, isDirty: true });
  },

  selectPage: (pageId) => {
    set({ selectedPageId: pageId, selectedSectionId: null });
  },

  selectSection: (sectionId) => {
    set({ selectedSectionId: sectionId });
  },

  addPage: (page) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        pages: [...content.pages, page],
      },
      isDirty: true,
    });
  },

  updatePage: (pageId, updates) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        pages: content.pages.map((p) =>
          p.id === pageId ? { ...p, ...updates } : p
        ),
      },
      isDirty: true,
    });
  },

  deletePage: (pageId) => {
    const { content, selectedPageId } = get();
    if (!content) return;
    
    const newPages = content.pages.filter((p) => p.id !== pageId);
    set({
      content: {
        ...content,
        pages: newPages,
      },
      selectedPageId: selectedPageId === pageId ? (newPages[0]?.id || null) : selectedPageId,
      isDirty: true,
    });
  },

  reorderPages: (fromIndex, toIndex) => {
    const { content } = get();
    if (!content) return;
    
    const pages = [...content.pages];
    const [removed] = pages.splice(fromIndex, 1);
    pages.splice(toIndex, 0, removed);
    
    set({
      content: { ...content, pages },
      isDirty: true,
    });
  },

  addSection: (pageId, section, index) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        pages: content.pages.map((p) => {
          if (p.id !== pageId) return p;
          const sections = [...p.sections];
          if (index !== undefined) {
            sections.splice(index, 0, section);
          } else {
            sections.push(section);
          }
          return { ...p, sections };
        }),
      },
      isDirty: true,
    });
  },

  updateSection: (pageId, sectionId, props) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        pages: content.pages.map((p) => {
          if (p.id !== pageId) return p;
          return {
            ...p,
            sections: p.sections.map((s) =>
              s.id === sectionId ? { ...s, props: { ...s.props, ...props } } : s
            ),
          };
        }),
      },
      isDirty: true,
    });
  },

  deleteSection: (pageId, sectionId) => {
    const { content, selectedSectionId } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        pages: content.pages.map((p) => {
          if (p.id !== pageId) return p;
          return {
            ...p,
            sections: p.sections.filter((s) => s.id !== sectionId),
          };
        }),
      },
      selectedSectionId: selectedSectionId === sectionId ? null : selectedSectionId,
      isDirty: true,
    });
  },

  reorderSections: (pageId, fromIndex, toIndex) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        pages: content.pages.map((p) => {
          if (p.id !== pageId) return p;
          const sections = [...p.sections];
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          return { ...p, sections };
        }),
      },
      isDirty: true,
    });
  },

  updateTheme: (theme) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: {
        ...content,
        theme: { ...content.theme, ...theme },
      },
      isDirty: true,
    });
  },

  updateNavigation: (navigation) => {
    const { content } = get();
    if (!content) return;
    
    set({
      content: { ...content, navigation },
      isDirty: true,
    });
  },

  setIsSaving: (isSaving) => set({ isSaving }),
  setIsPublishing: (isPublishing) => set({ isPublishing }),
  
  markSaved: () => {
    const { content } = get();
    set({
      isDirty: false,
      originalContent: content ? JSON.parse(JSON.stringify(content)) : null,
    });
  },

  setPreviewMode: (previewMode) => set({ previewMode }),

  setDeploymentStatus: (deploymentStatus) => set({ deploymentStatus }),

  setCustomDomain: (customDomain, verified) => set({
    customDomain,
    domainVerified: verified ?? false,
  }),

  reset: () => set(initialState),
}));
