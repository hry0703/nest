import { NestInterceptor } from "@nestjs/common";
import { ExecutionContext } from "./@nestjs/common";
import { Observable, tap } from "rxjs";

export class Logger2Interceptor implements NestInterceptor {
    intercept(context:ExecutionContext,next:any):Observable<any> {
        console.log('Before2');
        const now = Date.now();
        return next.handle().pipe(tap(()=>{
            console.log(`After2 ${Date.now()-now}ms`)
        }))
    }
}