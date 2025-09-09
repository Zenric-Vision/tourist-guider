import { HttpStatus } from '@nestjs/common';
import { 
  ApiResponse, 
  PaginatedResponse, 
  AuthResponse, 
  OtpResponse,
  HealthResponse,
  ValidationError,
  ErrorResponse
} from '../interfaces/api-response.interface';

/**
 * Generic Response Utility Class for NestJS
 * Provides consistent response formatting across all endpoints
 */
export class ResponseUtil {
  /**
   * Create a successful response
   */
  static success<T>(
    data: T,
    message: string = 'Operation successful',
    statusCode: number = HttpStatus.OK
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      statusCode,
    };
  }

  /**
   * Create a created response (201)
   */
  static created<T>(
    data: T,
    message: string = 'Resource created successfully'
  ): ApiResponse<T> {
    return this.success(data, message, HttpStatus.CREATED);
  }

  /**
   * Create a no content response (204)
   */
  static noContent(message: string = 'Operation completed successfully'): ApiResponse<null> {
    return {
      success: true,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully'
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Create an authentication response
   */
  static authSuccess<T>(
    data: T,
    token: string,
    message: string = 'Authentication successful'
  ): AuthResponse<T> {
    return {
      success: true,
      message,
      data,
      token,
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Create an authentication response that requires verification
   */
  static authRequiresVerification<T>(
    data: T,
    message: string = 'Verification required',
    otpSent: boolean = false
  ): AuthResponse<T> {
    return {
      success: true,
      message,
      data,
      requiresVerification: true,
      otpSent,
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Create an OTP response
   */
  static otpSuccess(
    message: string = 'OTP sent successfully',
    otpSent: boolean = true,
    expiresIn: number = 15
  ): OtpResponse {
    return {
      success: true,
      message,
      data: null,
      otpSent,
      expiresIn,
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Create a health check response
   */
  static health(
    status: string,
    uptime: number,
    version: string,
    environment: string
  ): HealthResponse {
    return {
      success: true,
      message: 'Health check successful',
      data: {
        status,
        uptime,
        timestamp: new Date().toISOString(),
        version,
        environment,
      },
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Create an error response
   */
  static error(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
    errors?: ValidationError[]
  ): ErrorResponse {
    const response: ErrorResponse = {
      success: false,
      message,
      error,
      errors,
      timestamp: new Date().toISOString(),
      statusCode,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && error) {
      response.stack = error;
    }

    return response;
  }

  /**
   * Create a bad request response (400)
   */
  static badRequest(
    message: string = 'Bad request',
    errors?: ValidationError[]
  ): ErrorResponse {
    return this.error(message, HttpStatus.BAD_REQUEST, 'Bad Request', errors);
  }

  /**
   * Create an unauthorized response (401)
   */
  static unauthorized(
    message: string = 'Unauthorized',
    error?: string
  ): ErrorResponse {
    return this.error(message, HttpStatus.UNAUTHORIZED, error || 'Unauthorized');
  }

  /**
   * Create a forbidden response (403)
   */
  static forbidden(
    message: string = 'Forbidden',
    error?: string
  ): ErrorResponse {
    return this.error(message, HttpStatus.FORBIDDEN, error || 'Forbidden');
  }

  /**
   * Create a not found response (404)
   */
  static notFound(
    message: string = 'Resource not found',
    error?: string
  ): ErrorResponse {
    return this.error(message, HttpStatus.NOT_FOUND, error || 'Not Found');
  }

  /**
   * Create a conflict response (409)
   */
  static conflict(
    message: string = 'Resource already exists',
    error?: string
  ): ErrorResponse {
    return this.error(message, HttpStatus.CONFLICT, error || 'Conflict');
  }

  /**
   * Create an unprocessable entity response (422)
   */
  static unprocessableEntity(
    message: string = 'Validation failed',
    errors?: ValidationError[]
  ): ErrorResponse {
    return this.error(message, HttpStatus.UNPROCESSABLE_ENTITY, 'Validation Error', errors);
  }

  /**
   * Create an internal server error response (500)
   */
  static internalServerError(
    message: string = 'Internal server error',
    error?: string
  ): ErrorResponse {
    return this.error(message, HttpStatus.INTERNAL_SERVER_ERROR, error || 'Internal Server Error');
  }

  /**
   * Create validation errors from class-validator errors
   */
  static createValidationErrors(errors: any[]): ValidationError[] {
    return errors.map(error => ({
      field: error.property,
      message: Object.values(error.constraints || {}).join(', '),
      value: error.value,
    }));
  }
}
