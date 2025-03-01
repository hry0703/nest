import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export interface CanActivate{
    canActivate(context:ExecutionContext):boolean | Promise<boolean> | Observable<boolean>
}