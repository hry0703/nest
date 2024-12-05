import { RequestMethod } from "./request.method.enum"

export interface MiddlewareConsumer {
    // 应用多个中间件
    apply(...middleware):this,
    // 配置应用此中间件的路由
    forRoutes(...routes:Array<string|{path:string,method:RequestMethod}|Function>)
    exclude(...routes:Array<string|{path:string,method:RequestMethod}>)
}