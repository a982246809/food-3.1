import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: string;
  data: T;
  msg: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // Handle specifically returning an error code inside the controller
        if (data && typeof data === 'object' && data.code && data.msg !== undefined) {
           return data;
        }

        return {
          code: '0000',
          data,
          msg: 'success',
        };
      }),
    );
  }
}
