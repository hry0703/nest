import { CallHandler, NestInterceptor } from "@nestjs/common";
import { ExecutionContext } from "./@nestjs/common";
import { Observable, tap } from "rxjs";

export class Logger1Interceptor implements NestInterceptor {
    intercept(context:ExecutionContext,next:CallHandler<any>):Observable<any> {
        console.log('Before1');
        const now = Date.now();
        return next.handle().pipe(tap(()=>{
            console.log(`After1 ${Date.now()-now}ms`)
        }))
    }
}