import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Auth token key
export const AUTH_TOKEN_KEY = 'wbf_auth_token';

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      Cookies.remove(AUTH_TOKEN_KEY);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to set auth token
export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 }); // 7 days
};

// Helper to remove auth token
export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

// Helper to get auth token
export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export default apiClient;
