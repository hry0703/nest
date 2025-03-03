import { Injectable, NestInterceptor, ExecutionContext, RequestTimeoutException, CallHandler } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next:CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      timeout(1000),
      catchError(err => {
        console.log('err');
        if (err instanceof TimeoutError) {
            console.log('TimeoutError');
            
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  };
};