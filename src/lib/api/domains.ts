import apiClient from './client';
import { Domain } from '../types';
import { ApiResponse, AddDomainRequest, DnsVerificationInfo } from '../types/api';

// Get all domains for current user
export const getDomains = async (): Promise<Domain[]> => {
  const response = await apiClient.get<ApiResponse<Domain[]>>('/domains');
  return response.data.data;
};

// Add domain to site
export const addDomain = async (data: AddDomainRequest): Promise<DnsVerificationInfo> => {
  const response = await apiClient.post<ApiResponse<DnsVerificationInfo>>('/domains', data);
  return response.data.data;
};

// Verify domain ownership
export const verifyDomain = async (domainId: string): Promise<Domain> => {
  const response = await apiClient.post<ApiResponse<Domain>>(
    `/domains/${domainId}/verify`
  );
  return response.data.data;
};

// Check DNS status
export const checkDnsStatus = async (domainId: string): Promise<{ verified: boolean; message: string }> => {
  const response = await apiClient.get<ApiResponse<{ verified: boolean; message: string }>>(
    `/domains/${domainId}/dns-status`
  );
  return response.data.data;
};

// Delete domain
export const deleteDomain = async (domainId: string): Promise<void> => {
  await apiClient.delete(`/domains/${domainId}`);
};
