import apiClient from './client';
import { UserSite, TemplateConfig, AvailableUpgrade, DynamicContentItem } from '../types';
import { ApiResponse, CreateSiteRequest } from '../types/api';

// Get all sites for current user
export const getSites = async (): Promise<UserSite[]> => {
  const response = await apiClient.get<ApiResponse<UserSite[]>>('/sites');
  return response.data.data;
};

// Create new site (clone template)
export const createSite = async (data: CreateSiteRequest): Promise<UserSite> => {
  const response = await apiClient.post<ApiResponse<UserSite>>('/sites', data);
  return response.data.data;
};

// Get site by siteId
export const getSite = async (siteId: string): Promise<UserSite> => {
  const response = await apiClient.get<ApiResponse<UserSite>>(`/sites/${siteId}`);
  return response.data.data;
};

// Update draft content
export const updateDraft = async (
  siteId: string,
  content: Partial<TemplateConfig>
): Promise<UserSite> => {
  const response = await apiClient.put<ApiResponse<UserSite>>(
    `/sites/${siteId}/draft`,
    { content }
  );
  return response.data.data;
};

// Get preview (draft) content
export const getPreview = async (siteId: string): Promise<TemplateConfig> => {
  const response = await apiClient.get<ApiResponse<{ content: TemplateConfig }>>(
    `/sites/${siteId}/preview`
  );
  return response.data.data.content;
};

// Get published content (public endpoint)
export const getPublished = async (siteId: string): Promise<TemplateConfig> => {
  const baseUrl = (apiClient.defaults.baseURL || '').replace(/\/api$/, '');
  const response = await apiClient.get<ApiResponse<{ content: TemplateConfig }>>(
    `${baseUrl}/public/sites/${siteId}`
  );
  return response.data.data.content;
};

// Publish site
export const publishSite = async (siteId: string): Promise<UserSite> => {
  const response = await apiClient.post<ApiResponse<UserSite>>(
    `/sites/${siteId}/publish`
  );
  return response.data.data;
};

// Check for template updates
export const checkUpdates = async (siteId: string): Promise<AvailableUpgrade | null> => {
  const response = await apiClient.get<ApiResponse<AvailableUpgrade | null>>(
    `/sites/${siteId}/check-updates`
  );
  return response.data.data;
};

// Apply template update
export const applyUpdate = async (siteId: string): Promise<UserSite> => {
  const response = await apiClient.post<ApiResponse<UserSite>>(
    `/sites/${siteId}/apply-update`
  );
  return response.data.data;
};

// Get dynamic content
export const getDynamicContent = async (
  siteId: string,
  collectionType: string
): Promise<DynamicContentItem[]> => {
  const response = await apiClient.get<ApiResponse<DynamicContentItem[]>>(
    `/sites/${siteId}/dynamic/${collectionType}`
  );
  return response.data.data;
};

// Add dynamic content item
export const addDynamicContent = async (
  siteId: string,
  collectionType: string,
  item: Omit<DynamicContentItem, 'id'>
): Promise<DynamicContentItem> => {
  const response = await apiClient.post<ApiResponse<DynamicContentItem>>(
    `/sites/${siteId}/dynamic/${collectionType}`,
    item
  );
  return response.data.data;
};
