import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Roles2 } from './roles2.decorator'
@Injectable()
export class AuthGuard2 implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // 从处理程序的方法的元数据上获取角色信息
        // const roles = this.reflector.get('roles',context.getHandler())
        const roles = this.reflector.get(Roles2 as any,context.getHandler()) as any as string[]
        console.log('1roles',roles);
        // 如果没有为此路由设置roles 则允许访问
        if(!roles){
            return true
        }
        // 获取当前的请求对象
        const request = context.switchToHttp().getRequest<Request>()
        // 获取当前请求的用户信息   这里假设用户信息存储在请求的query中
        const user = (request as any).user
        console.log('user',user);
        
        return matchRoles(roles,user.roles)
    }
}

const matchRoles = ( roles:string[],useRoles:string[])=>{
    return useRoles.some(useRole=>roles.includes(useRole))
}