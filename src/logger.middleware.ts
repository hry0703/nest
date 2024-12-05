import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction } from "express";
import { AppSerive } from "./app.service";
@Injectable()
export class loggerMiddleware implements NestMiddleware {
    constructor(private appSerive:AppSerive){

    }
    use(req: Request, res: Response, next: NextFunction) {
        console.log('loggerMiddleware执行',this.appSerive.getConfig(), req.originalUrl);
        next()
    }
}