// API response types

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth response types
export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// Site creation request
export interface CreateSiteRequest {
  templateId: string;
  name?: string;
}

// Domain request
export interface AddDomainRequest {
  domain: string;
  siteId: string;
}

// DNS verification response
export interface DnsVerificationInfo {
  domain: string;
  verificationToken: string;
  recordType: 'TXT' | 'CNAME';
  recordName: string;
  recordValue: string;
  instructions: string;
}
