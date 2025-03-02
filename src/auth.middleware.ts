import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction } from "express";
import { AppSerive } from "./app.service";
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private appSerive:AppSerive){

    }
    use(req: Request, res: Response, next: NextFunction) {
       /**
        * 一般会在此处给req.use赋值
        * 如何赋值关键要看鉴权使用的哪种方式 一般有两种 session和token
        * 
        */
       // 如果使用上次用户登陆后把用户信息保存在session中的话
       // req.user = req.session.user
       // 如果使用的是JWT的话
       // const token -> user -> req.uesr = 
        (req as any).user = { id:1,name:'nick',roles:[req.query.roles]}
        // console.log('AuthMiddleware执行',req);
        next()
    }
}