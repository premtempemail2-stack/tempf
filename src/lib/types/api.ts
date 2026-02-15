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

// Publish site request
export interface PublishSiteRequest {
  customDomain?: string;
}

// Update domain request
export interface UpdateDomainRequest {
  customDomain: string | null;
}

// Domain setup instructions (returned from publish/update)
export interface DomainSetupInfo {
  domainId: string;
  verificationToken: string;
  instructions: Record<string, string>;
}

// Publish site response
export interface PublishSiteResponse {
  siteId: string;
  publishedAt: string;
  publishedUrl: string;
  customDomain: string | null;
  domainVerified: boolean;
  isFirstPublish: boolean;
  domainSetup?: DomainSetupInfo;
}

// Update domain response
export interface UpdateDomainResponse {
  siteId: string;
  customDomain: string | null;
  domainVerified: boolean;
  domainSetup?: DomainSetupInfo;
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
