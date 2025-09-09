import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response.util';
import { ApiResponse, ErrorResponse } from '../interfaces/api-response.interface';

/**
 * Global Response Interceptor
 * Automatically formats all API responses to follow the standard structure
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // If data is already formatted as ApiResponse, return as is
        if (this.isApiResponse(data)) {
          return data;
        }

        // If data is null/undefined and status is 204, return no content response
        if (data === null || data === undefined) {
          const noContentResponse = ResponseUtil.noContent();
          response.status(HttpStatus.NO_CONTENT);
          return noContentResponse;
        }

        // Format as success response
        const successResponse = ResponseUtil.success(data);
        return successResponse;
      }),
      catchError((error) => {
        // Handle HttpException
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const message = error.message;
          const response = error.getResponse();

          let errorResponse: ErrorResponse;

          switch (status) {
            case HttpStatus.BAD_REQUEST:
              errorResponse = ResponseUtil.badRequest(message);
              break;
            case HttpStatus.UNAUTHORIZED:
              errorResponse = ResponseUtil.unauthorized(message);
              break;
            case HttpStatus.FORBIDDEN:
              errorResponse = ResponseUtil.forbidden(message);
              break;
            case HttpStatus.NOT_FOUND:
              errorResponse = ResponseUtil.notFound(message);
              break;
            case HttpStatus.CONFLICT:
              errorResponse = ResponseUtil.conflict(message);
              break;
            case HttpStatus.UNPROCESSABLE_ENTITY:
              errorResponse = ResponseUtil.unprocessableEntity(message);
              break;
            default:
              errorResponse = ResponseUtil.error(message, status);
          }

          // Handle validation errors
          if (typeof response === 'object' && response !== null && 'message' in response) {
            const validationResponse = response as any;
            if (Array.isArray(validationResponse.message)) {
              errorResponse.errors = ResponseUtil.createValidationErrors(validationResponse.message);
            }
          }

          return throwError(() => errorResponse);
        }

        // Handle other errors
        const errorResponse = ResponseUtil.internalServerError(
          'An unexpected error occurred',
          error.message
        );

        return throwError(() => errorResponse);
      }),
    );
  }

  /**
   * Check if the data is already formatted as ApiResponse
   */
  private isApiResponse(data: any): data is ApiResponse<T> {
    return (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      'message' in data &&
      'timestamp' in data &&
      'statusCode' in data
    );
  }
}
