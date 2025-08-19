export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'tourist' | 'guide' | 'admin';
  isActive?: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  bio?: string;
  languages?: string[];
  experienceYears?: number;
  locations?: string[];
  pricePerHour?: number;
  pricePerDay?: number;
  rating?: number;
  availability?: AvailabilitySlot[];
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  date: string;
  slots: string[];
}

export interface Booking {
  _id: string;
  touristId: string;
  guideId: string;
  tourist?: User;
  guide?: User;
  place: string;
  startDate: string;
  durationHours: number;
  numPeople: number;
  specialRequests?: string;
  price: number;
  status: 'pending' | 'accepted' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  isPaid?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  bookingId: string;
  touristId: string;
  guideId: string;
  tourist?: User;
  guide?: User;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SearchFilters {
  location?: string;
  date?: string;
  minPrice?: string;
  maxPrice?: string;
  languages?: string[];
  page?: number;
  limit?: number;
}

export interface BookingFormData {
  guideId: string;
  place: string;
  startDate: string;
  durationHours: number;
  numPeople: number;
  specialRequests?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
} 