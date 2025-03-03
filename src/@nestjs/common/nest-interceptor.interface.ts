import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export interface NestInterceptor{
    intercept(context:ExecutionContext,next:any)
}

export interface CallHandler<T=any>{
    handle():Observable<T>
}