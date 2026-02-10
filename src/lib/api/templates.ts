import apiClient from './client';
import { Template } from '../types';
import { ApiResponse } from '../types/api';

// Get all templates
export const getTemplates = async (): Promise<Template[]> => {
  const response = await apiClient.get<ApiResponse<Template[]>>('/templates');
  return response.data.data;
};

// Get template by ID
export const getTemplate = async (id: string): Promise<Template> => {
  const response = await apiClient.get<ApiResponse<Template>>(`/templates/${id}`);
  return response.data.data;
};

// Get template versions
export const getTemplateVersions = async (id: string): Promise<string[]> => {
  const response = await apiClient.get<ApiResponse<string[]>>(`/templates/${id}/versions`);
  return response.data.data;
};
