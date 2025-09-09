/**
 * Generic API Response Interfaces for NestJS
 * Provides consistent response structure across all endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
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

export interface HealthResponse extends ApiResponse<{
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
}> {}

// Generic response types for different HTTP status codes
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
}

export interface CreatedResponse<T = any> extends ApiResponse<T> {
  success: true;
  statusCode: 201;
}

export interface NoContentResponse extends ApiResponse<null> {
  success: true;
  statusCode: 204;
  data: null;
}

export interface BadRequestResponse extends ErrorResponse {
  success: false;
  statusCode: 400;
}

export interface UnauthorizedResponse extends ErrorResponse {
  success: false;
  statusCode: 401;
}

export interface ForbiddenResponse extends ErrorResponse {
  success: false;
  statusCode: 403;
}

export interface NotFoundResponse extends ErrorResponse {
  success: false;
  statusCode: 404;
}

export interface ConflictResponse extends ErrorResponse {
  success: false;
  statusCode: 409;
}

export interface UnprocessableEntityResponse extends ErrorResponse {
  success: false;
  statusCode: 422;
}

export interface InternalServerErrorResponse extends ErrorResponse {
  success: false;
  statusCode: 500;
}

// Union type for all possible response types
export type ApiResponseType<T = any> = 
  | SuccessResponse<T>
  | CreatedResponse<T>
  | NoContentResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | ForbiddenResponse
  | NotFoundResponse
  | ConflictResponse
  | UnprocessableEntityResponse
  | InternalServerErrorResponse
  | PaginatedResponse<T>
  | AuthResponse<T>
  | OtpResponse
  | HealthResponse;
