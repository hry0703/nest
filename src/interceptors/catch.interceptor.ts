import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request } from 'express';

let cacheMap = new Map([])
// cacheMap.set('1',{id:1,name:'user1'})
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: any): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const id = request.query.id;
    const user = cacheMap.get(id)
    console.log('user',user);
    
    if(user){
        return of(user)
    }
    return next.handle().pipe(tap((value)=>{
        cacheMap.set(id,value)
    }))
  }
}  