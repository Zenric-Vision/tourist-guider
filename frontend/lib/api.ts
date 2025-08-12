import axios from 'axios';
import { User, Booking, Review, SearchFilters, BookingFormData, AuthResponse, PaymentIntent } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
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

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/users/upload-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Guides API
export const guidesAPI = {
  search: async (filters: SearchFilters): Promise<{ guides: User[]; total: number; page: number; limit: number }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
    const response = await api.get(`/guides?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  updateAvailability: async (availability: any[]): Promise<User> => {
    const response = await api.patch('/guides/availability', { availability });
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (data: BookingFormData): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getMyBookings: async (role?: 'tourist' | 'guide'): Promise<Booking[]> => {
    const params = role ? `?role=${role}` : '';
    const response = await api.get(`/bookings/my${params}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  create: async (data: { bookingId: string; guideId: string; rating: number; comment?: string }): Promise<Review> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getByGuide: async (guideId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/guide/${guideId}`);
    return response.data;
  },

  getByTourist: async (touristId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/tourist/${touristId}`);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: async (bookingId: string): Promise<PaymentIntent> => {
    const response = await api.post('/payments/create-intent', { bookingId });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },
};

export default api; 