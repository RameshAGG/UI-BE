import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../utils/response.util';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const contentType = request.headers['content-type'];
    
    if (contentType) {
      response.setHeader('Content-Type', contentType);
    }

    Object.keys(request.headers).forEach(header => {
      if (header !== 'host' && header !== 'connection') {
        response.setHeader(header, request.headers[header]);
      }
    });

    return next.handle().pipe(
      map(data => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        const statusCode = response.statusCode || HttpStatus.OK;

        if (contentType && contentType.includes('multipart/form-data')) {
          return data;
        }

        return ResponseUtil.success(data, 'Success', statusCode);
      }),
    );
  }
} 