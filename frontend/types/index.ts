// Base interfaces
export interface BaseUser {
  id: string;
  _id?: string; // MongoDB ID (for compatibility)
  email?: string;
  mobile?: string;
  city?: string; // Made optional to match backend
  isVerified: boolean;
  isActive?: boolean; // Made optional as backend doesn't always return it
  tourPoints: number;
  badges: string[];
  createdAt?: string; // Made optional as backend doesn't always return it
  updatedAt?: string; // Made optional as backend doesn't always return it
  role?: 'admin' | 'guide' | 'tourist'; // User role for authorization
  userType?: 'traveler' | 'guider' | 'admin'; // User type (legacy compatibility)
  name?: string; // Display name (for compatibility)
  rating?: number; // User rating (for guides)
}

// User interface (for travelers)
export interface User extends BaseUser {
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  travelStyle?: 'Adventure' | 'Cultural' | 'Relaxation' | 'Wildlife';
  preferredCategories?: string[];
  travelPreferences?: string;
}

// Guider interface
export interface Guider extends BaseUser {
  showcaseName: string;
  guiderType: 'Professional' | 'Agency';
  overview: string;
  
  // Additional properties for compatibility
  name?: string; // Display name (for compatibility)
  profilePicture?: string; // Profile picture URL
  bio?: string; // Guide bio/description
  locations?: string[]; // Locations where guide operates
  languages?: string[]; // Languages spoken
  experienceYears?: number; // Years of experience
  phoneNumber?: string; // Phone number
  
  // Progress fields
  basicDetailsCompleted: boolean;
  videoUploaded: boolean;
  eSignCompleted: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  
  // Agency specific
  companyName?: string;
  foundingDate?: string;
  websiteUrl?: string;
  socialMediaProfile?: string;
  govDocumentUrl?: string;
  officeAddressProofUrl?: string;
  
  // Professional specific
  fullName?: string;
  languagesKnown?: string[];
  hasVehicle?: boolean;
  vehicleDescription?: string;
  isExperienced?: boolean;
  profGovDocumentUrl?: string;
  
  // Optional compliance
  panCardUrl?: string;
  gstCertificateUrl?: string;
  bankStatementUrl?: string;
  motApprovalLetterUrl?: string;
  incomeTaxReturnsUrl?: string;
  
  // Progress data
  videoUrl?: string;
  eSignDocUrl?: string;
  rejectionReason?: string;

  // Tour Guide Specific Fields
  tourTypes?: string[]; // ['Cultural', 'Adventure', 'Food', 'Historical', 'Nature', 'Spiritual', 'Shopping', 'Photography']
  specializations?: string[]; // ['Ancient Temples', 'Street Food', 'Yoga', 'Ayurveda', 'Wildlife', 'Architecture', 'Art', 'Music']
  certifications?: string[]; // ['Government Licensed', 'Tourism Board Certified', 'First Aid', 'Wildlife Guide', 'Cultural Expert']
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerTour?: number;
  currency?: string;
  rating?: number;
  totalReviews?: number;
  totalTours?: number;
  responseTime?: number; // in hours
  cancellationPolicy?: string;
  tourDurations?: string[]; // ['Half Day', 'Full Day', 'Multi Day', 'Custom']
  groupSizes?: string[]; // ['Private', 'Small Group', 'Large Group']
  accessibility?: string[]; // ['Wheelchair Accessible', 'Kid Friendly', 'Senior Friendly', 'Pet Friendly']
  availability?: Array<{ date: string; slots: string[] }>;
  gallery?: string[]; // Tour photos
  highlights?: string[]; // Key attractions/experiences
  aboutMe?: string; // Detailed guide description
  whyChooseMe?: string; // Unique selling points
  languagesSpoken?: string[]; // More detailed language info
  education?: string;
  awards?: string[];
  isFeatured?: boolean;

  // India-specific fields
  indianStates?: string[]; // States in India where guide operates
  indianCities?: string[]; // Cities in India where guide operates
  indianLanguages?: string[]; // Indian languages spoken
  indianCuisines?: string[]; // Knowledge of Indian cuisines
  indianFestivals?: string[]; // Knowledge of Indian festivals
  hasGSTNumber?: boolean;
  gstNumber?: string;
}

// OTP interfaces
export interface SendOtpRequest {
  email?: string;
  mobile?: string;
  userType: 'traveler' | 'guider';
}

export interface VerifyOtpRequest {
  email?: string;
  mobile?: string;
  otp: string;
  userType: 'traveler' | 'guider';
}

export interface ResendOtpRequest {
  email?: string;
  mobile?: string;
  userType: 'traveler' | 'guider';
}

// Authentication interfaces
export interface TravelerSignupRequest {
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  city: string;
  password: string;
}

export interface GuiderSignupRequest {
  showcaseName: string;
  email?: string;
  mobile?: string;
  password: string;
  guiderType: 'Professional' | 'Agency';
  city: string;
  overview: string;
}

export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

// Generic API Response interfaces (matching backend)
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path: string;
  statusCode: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthResponse<T = any> extends ApiResponse<T> {
  token?: string;
  requiresVerification?: boolean;
  otpSent?: boolean;
  otp?: string;
  newOtp?: string;
}

export interface OtpResponse extends ApiResponse<null> {
  otpSent: boolean;
  expiresIn: number; // in minutes
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ErrorResponse extends ApiResponse<null> {
  errors?: ValidationError[];
  stack?: string; // Only in development
}

// Travel preferences interface
export interface TravelPreferences {
  travelStyle?: string;
  preferredCategories?: string[];
  travelPreferences?: string;
  city?: string;
}

// Profile update interfaces
export interface UpdateTravelerProfileRequest {
  travelStyle?: string;
  preferredCategories?: string[];
  travelPreferences?: string;
  city?: string;
}

export interface UpdateGuiderDetailsRequest {
  companyName?: string;
  foundingDate?: string;
  websiteUrl?: string;
  socialMediaProfile?: string;
  govDocumentUrl?: string;
  officeAddressProofUrl?: string;
  fullName?: string;
  languagesKnown?: string[];
  hasVehicle?: boolean;
  vehicleDescription?: string;
  isExperienced?: boolean;
  profGovDocumentUrl?: string;
}

export interface UpdateGuiderProgressRequest {
  basicDetailsCompleted?: boolean;
  videoUploaded?: boolean;
  eSignCompleted?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

// Password change interface
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Tour sample interface
export interface TourSample {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice: number;
  location: string;
  duration: string;
  category: string;
}

// Search and filter interfaces
export interface GuideSearchFilters {
  location?: string;
  guiderType?: 'Professional' | 'Agency';
  isVerified?: boolean;
  limit?: number;
  offset?: number;
}

// Admin interfaces
export interface AdminUserStats {
  totalTravelers: number;
  totalGuiders: number;
  verifiedGuiders: number;
  pendingApprovals: number;
}

// Booking interface
export interface Booking {
  _id: string;
  tourist?: {
    _id: string;
    name: string;
  };
  guide?: {
    _id: string;
    name: string;
  };
  place: string;
  startDate: string;
  durationHours: number;
  specialRequests?: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  isPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Review interface
export interface Review {
  _id: string;
  tourist?: {
    _id: string;
    name: string;
  };
  guide?: {
    _id: string;
    name: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

// Legacy interface for backward compatibility (can be removed later)
export interface Traveler extends User {
  // This maintains backward compatibility with existing code
  // Gradually migrate to use User interface
} 