import apiClient, { setAuthToken, removeAuthToken } from './client';
import { User } from '../types';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types/api';

// Register new user
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
  const { token, user } = response.data.data;
  setAuthToken(token);
  return { token, user };
};

// Login user
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  const { token, user } = response.data.data;
  setAuthToken(token);
  return { token, user };
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};

// Logout user
export const logout = () => {
  removeAuthToken();
};
