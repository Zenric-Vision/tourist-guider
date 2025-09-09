import axios from 'axios';
import {
  TravelerSignupRequest,
  GuiderSignupRequest,
  LoginRequest,
  AuthResponse,
  OtpResponse,
  ApiResponse,
  UpdateTravelerProfileRequest,
  UpdateGuiderDetailsRequest,
  UpdateGuiderProgressRequest,
  ChangePasswordRequest,
  User,
  Guider,
  GuideSearchFilters,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// OTP API - Legacy (kept for backward compatibility if needed)
export const otpAPI = {
  // These methods are no longer used in the new streamlined flow
  // but kept for potential backward compatibility
};

// Authentication API
export const authAPI = {
  // Traveler authentication - New streamlined approach
  registerTraveler: async (data: TravelerSignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/traveler/register', data);
    return response.data;
  },

  verifyOtpAndCompleteRegistration: async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/traveler/verify-otp', data);
    return response.data;
  },

  resendOtpForTraveler: async (data: { email: string; userName?: string; actionType?: 'registration' | 'login' }): Promise<OtpResponse> => {
    const response = await api.post('/auth/traveler/resend-otp', data);
    return response.data;
  },

  loginTraveler: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/traveler/login', data);
    return response.data;
  },

  // Guider authentication - New streamlined approach
  registerGuider: async (data: GuiderSignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/guider/register', data);
    return response.data;
  },

  verifyOtpAndCompleteGuiderRegistration: async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/guider/verify-otp', data);
    return response.data;
  },

  resendOtpForGuider: async (data: { email: string; userName?: string; actionType?: 'registration' | 'login' }): Promise<OtpResponse> => {
    const response = await api.post('/auth/guider/resend-otp', data);
    return response.data;
  },

  loginGuider: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/guider/login', data);
    return response.data;
  },

  // Password management
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
  },
};

// Users API (for travelers)
export const usersAPI = {
  getMyProfile: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/users/me/profile', data);
    return response.data;
  },

  uploadProfilePicture: async (profilePictureUrl: string): Promise<User> => {
    const response = await api.patch('/users/me/profile-picture', { profilePictureUrl });
    return response.data;
  },

  updateTravelPreferences: async (data: UpdateTravelerProfileRequest): Promise<User> => {
    const response = await api.patch('/users/me/travel-preferences', data);
    return response.data;
  },

  getTouristProfile: async (): Promise<User> => {
    const response = await api.get('/users/me/tourist-profile');
    return response.data;
  },
};

// Guiders API
export const guidersAPI = {
  getAll: async (filters: GuideSearchFilters = {}): Promise<Guider[]> => {
    const response = await api.get('/guides', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Guider> => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  updateVerificationProgress: async (guiderId: string, progressData: UpdateGuiderProgressRequest): Promise<Guider> => {
    const response = await api.patch(`/guides/${guiderId}/verification-progress`, progressData);
    return response.data;
  },

  updateProfile: async (guiderId: string, profileData: UpdateGuiderDetailsRequest): Promise<Guider> => {
    const response = await api.patch(`/guides/${guiderId}/profile`, profileData);
    return response.data;
  },

  updateAvailability: async (guiderId: string, availability: any[]): Promise<Guider> => {
    const response = await api.patch(`/guides/${guiderId}/availability`, { availability });
    return response.data;
  },

  getFeatured: async (limit: number = 10): Promise<Guider[]> => {
    const response = await api.get('/guides/featured', { params: { limit } });
    return response.data;
  },

  getPopularDestinations: async (): Promise<string[]> => {
    const response = await api.get('/guides/popular-destinations');
    return response.data;
  },

  getTourTypes: async (): Promise<string[]> => {
    const response = await api.get('/guides/tour-types');
    return response.data;
  },

  getSpecializations: async (): Promise<string[]> => {
    const response = await api.get('/guides/specializations');
    return response.data;
  },

  getSimilar: async (guiderId: string, limit: number = 5): Promise<Guider[]> => {
    const response = await api.get(`/guides/${guiderId}/similar`, { params: { limit } });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async (limit: number = 50, offset: number = 0): Promise<User[]> => {
    const response = await api.get('/users', { params: { limit, offset } });
    return response.data;
  },

  searchUsers: async (query: string, limit: number = 20): Promise<User[]> => {
    const response = await api.get('/users/search', { params: { query, limit } });
    return response.data;
  },

  getUsersByRole: async (role: string, limit: number = 20, offset: number = 0): Promise<User[]> => {
    const response = await api.get(`/users/by-role/${role}`, { params: { limit, offset } });
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

// Legacy API for backward compatibility
export const travelersAPI = usersAPI;
export const guidesAPI = guidersAPI;

export default api; 