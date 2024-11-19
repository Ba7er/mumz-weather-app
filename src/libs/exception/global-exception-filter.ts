import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse['message'];

    response.status(status).json({
      result: false,
      error: {
        statusCode: status,
        message: errorMessage,
        path: request.url,
      },
    });
  }
}
