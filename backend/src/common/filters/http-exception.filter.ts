import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response.util';

/**
 * Global HTTP Exception Filter
 * Catches all HTTP exceptions and formats them consistently
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message = exception.message;
    let errors: any[] = [];

    // Handle validation errors
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      
      if (responseObj.message) {
        if (Array.isArray(responseObj.message)) {
          // Class-validator errors
          message = 'Validation failed';
          errors = ResponseUtil.createValidationErrors(responseObj.message);
        } else {
          message = responseObj.message;
        }
      }
    }

    // Create error response
    let errorResponse: any;

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        errorResponse = ResponseUtil.badRequest(message, errors);
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
        errorResponse = ResponseUtil.unprocessableEntity(message, errors);
        break;
      default:
        errorResponse = ResponseUtil.error(message, status);
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}

/**
 * Global Exception Filter for all exceptions
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      error = exception.name;
      
      // Handle validation errors from class-validator
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        if (responseObj.message && Array.isArray(responseObj.message)) {
          errors = responseObj.message.map((msg: string) => ({
            field: 'unknown',
            message: msg
          }));
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const errorResponse = ResponseUtil.error(message, status, error, errors.length > 0 ? errors : undefined);

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }
}
