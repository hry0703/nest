import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // throw new Error("Method not implemented.");
        // console.log('context',context);
        // 从处理程序的方法的元数据上获取角色信息
        const roles = this.reflector.get('roles',context.getHandler())
        // console.log('roles',roles);
        // 如果没有为此路由设置roles 则允许访问
        if(!roles){
            return true
        }
        // 获取当前的请求对象
        const request = context.switchToHttp().getRequest<Request>()
        // 获取当前请求的用户信息   这里假设用户信息存储在请求的query中
        const user = (request as any).user
        // console.log('user',user);
        
        return matchRoles(roles,user.roles)
    }
}

const matchRoles = ( roles:string[],useRoles:string[])=>{
    return useRoles.some(useRole=>roles.includes(useRole))
}