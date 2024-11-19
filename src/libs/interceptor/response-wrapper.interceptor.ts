import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  /**
   * Intercepts and wraps responses with a consistent structure for HTTP and GraphQL requests.
   *
   * Note: This can be enhanced to better differentiate between HTTP and GraphQL requests.
   */

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reqType = context.getType() as 'http' | 'graphql';
    return next.handle().pipe(
      map((data) => {
        if (reqType == 'graphql') {
          return { result: true, ...data };
        }
        return { result: true, data };
      }),
    );
  }
}
