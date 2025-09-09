import { applyDecorators } from '@nestjs/common';
import { ApiResponse as SwaggerApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { 
  ApiResponse as CustomApiResponse, 
  PaginatedResponse, 
  AuthResponse, 
  OtpResponse,
  HealthResponse,
  ErrorResponse 
} from '../interfaces/api-response.interface';

/**
 * Custom API Response Decorators for Swagger Documentation
 * Provides consistent Swagger documentation for all endpoints
 */

export function ApiSuccessResponse<T>(
  description: string = 'Operation successful',
  type?: new () => T,
  status: number = 200
) {
  return applyDecorators(
    SwaggerApiResponse({
      status,
      description,
      type: type || Object,
      schema: {
        example: {
          success: true,
          message: description,
          data: type ? {} : null,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/api/endpoint',
          statusCode: status,
        },
      },
    })
  );
}

export function ApiCreatedResponse<T>(
  description: string = 'Resource created successfully',
  type?: new () => T
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 201,
      description,
      type: type || Object,
      schema: {
        example: {
          success: true,
          message: description,
          data: type ? {} : null,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/api/endpoint',
          statusCode: 201,
        },
      },
    })
  );
}

export function ApiNoContentResponse(
  description: string = 'Operation completed successfully'
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 204,
      description,
      schema: {
        example: {
          success: true,
          message: description,
          data: null,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/api/endpoint',
          statusCode: 204,
        },
      },
    })
  );
}

export function ApiPaginatedResponse<T>(
  description: string = 'Data retrieved successfully',
  type?: new () => T
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 200,
      description,
      type: type || Object,
      schema: {
        example: {
          success: true,
          message: description,
          data: type ? [{}] : [],
          pagination: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10,
            hasNext: true,
            hasPrev: false,
          },
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/api/endpoint',
          statusCode: 200,
        },
      },
    })
  );
}

export function ApiAuthResponse<T>(
  description: string = 'Authentication successful',
  type?: new () => T,
  requiresVerification: boolean = false
) {
  const example: any = {
    success: true,
    message: description,
    data: type ? {} : null,
    timestamp: '2024-01-01T00:00:00.000Z',
    path: '/api/endpoint',
    statusCode: 200,
  };

  if (requiresVerification) {
    example.requiresVerification = true;
    example.otpSent = false;
  } else {
    example.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  }

  return applyDecorators(
    SwaggerApiResponse({
      status: 200,
      description,
      type: type || Object,
      schema: { example },
    })
  );
}

export function ApiOtpResponse(
  description: string = 'OTP sent successfully'
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 200,
      description,
      schema: {
        example: {
          success: true,
          message: description,
          data: null,
          otpSent: true,
          expiresIn: 15,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/api/endpoint',
          statusCode: 200,
        },
      },
    })
  );
}

export function ApiHealthResponse(
  description: string = 'Health check successful'
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 200,
      description,
      schema: {
        example: {
          success: true,
          message: description,
          data: {
            status: 'ok',
            uptime: 12345.67,
            timestamp: '2024-01-01T00:00:00.000Z',
            version: '1.0.0',
            environment: 'development',
          },
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/api/health',
          statusCode: 200,
        },
      },
    })
  );
}

export function ApiErrorResponse(
  status: number,
  description: string,
  example?: any
) {
  const defaultExamples = {
    400: {
      success: false,
      message: 'Bad request',
      error: 'Bad Request',
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 400,
    },
    401: {
      success: false,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 401,
    },
    403: {
      success: false,
      message: 'Forbidden',
      error: 'Forbidden',
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 403,
    },
    404: {
      success: false,
      message: 'Resource not found',
      error: 'Not Found',
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 404,
    },
    409: {
      success: false,
      message: 'Resource already exists',
      error: 'Conflict',
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 409,
    },
    422: {
      success: false,
      message: 'Validation failed',
      error: 'Validation Error',
      errors: [
        {
          field: 'email',
          message: 'Email must be a valid email address',
          value: 'invalid-email',
        },
      ],
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 422,
    },
    500: {
      success: false,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: '2024-01-01T00:00:00.000Z',
      path: '/api/endpoint',
      statusCode: 500,
    },
  };

  return applyDecorators(
    SwaggerApiResponse({
      status,
      description,
      schema: {
        example: example || defaultExamples[status] || defaultExamples[500],
      },
    })
  );
}

// Common error response decorators
export const ApiBadRequestResponse = (description: string = 'Bad request') =>
  ApiErrorResponse(400, description);

export const ApiUnauthorizedResponse = (description: string = 'Unauthorized') =>
  ApiErrorResponse(401, description);

export const ApiForbiddenResponse = (description: string = 'Forbidden') =>
  ApiErrorResponse(403, description);

export const ApiNotFoundResponse = (description: string = 'Resource not found') =>
  ApiErrorResponse(404, description);

export const ApiConflictResponse = (description: string = 'Resource already exists') =>
  ApiErrorResponse(409, description);

export const ApiUnprocessableEntityResponse = (description: string = 'Validation failed') =>
  ApiErrorResponse(422, description);

export const ApiInternalServerErrorResponse = (description: string = 'Internal server error') =>
  ApiErrorResponse(500, description);
