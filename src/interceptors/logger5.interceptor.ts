import { NestInterceptor } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class Logger5Interceptor implements NestInterceptor {
    intercept(context:ExecutionContext,next:any):Observable<any> {
        console.log('Before5');
        const now = Date.now();
        return next.handle().pipe(tap(()=>{
            console.log(`After5 ${Date.now()-now}ms`)
        }))
    }
}