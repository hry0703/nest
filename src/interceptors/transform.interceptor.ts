import { NestInterceptor } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";

export class TransformInterceptor implements NestInterceptor {
    intercept(context:ExecutionContext,next:any):Observable<any> {
        return next.handle().pipe(map((data)=>{
            console.log('TransformInterceptor',data);
            return { data }
        }))
    }
}