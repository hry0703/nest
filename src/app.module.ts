import {AppController} from './app.controller';
import { UserController } from './user/user.controller';
import { CoreModule } from "./core.module";
// import { CommonModule } from "./common.module";
// import { OtherModule } from "./other.module";
import { DynamicConfigModule } from "./dynamicConfig.module";

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// import { CorsMiddleware } from './middleware/cors.middleware';
// import { LoggerModule } from "./logger.module";
import { AppSerive } from './app.service';
import { loggerMiddleware } from './logger.middleware';
import { loggerFunction } from './logger-function.middleware';
import { APP_FILTER,APP_GUARD,APP_INTERCEPTOR,APP_PIPE } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception.filter';
import { App2Controller } from './app2.controller';
import { MyPipe } from './my.pipe';
import { AccountController } from './account.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthGuard } from './auth.guard';
import { PayController } from './pay.controller';
import { Logger5Interceptor } from './interceptors/logger5.interceptor';
import { Logger6Interceptor } from './interceptors/logger6.interceptor';
import { UploadController } from './upload.controller';
function logger1(req: Request, res: Response, next: any) {
    // console.log('logger1');
    next()
}

function logger2(req: Request, res: Response, next: any) {
    console.log('logger2');
    next()
}

@Module({
    // imports:[CommonModule,OtherModule],
    imports:[DynamicConfigModule.forRoot('-hry1122')],
    // controllers:[AppController, UserController],
    controllers:[AppController,App2Controller,AccountController,PayController,UploadController],
    // providers:[
    //     {
    //         provide:'SUFFIX',
    //         useValue:'suffix'
    //     },
    //     LoggerClassService, // 这样定义provider的话 token就是这个类本身，等价于下面这种写法 // 这种写法最多
    //     {
    //         provide:LoggerService,
    //         useClass:LoggerService // 说明提供的是一个类
    //     },
        
    //     {// 也是一种定义provider的方法
    //         provide:'StringToken',// 这是一个token 也称为标志 或者说令牌 也就是一个provider的名字
    //         useValue:new UseValueService('prefix')// 可以直接提供一个值
    //     },
    //     {
    //         provide:'FactoryToken',
    //         inject:['prefix1','SUFFIX'], // SUFFIX是个token这里期望实现传入的是 token为SUFFIX的provide的useValue 即suffix
    //         useFactory:(prefix1,prefix2)=>new UseFactory(prefix1,prefix2)
    //     }
    // ]
    // providers:[AppSerive],
    providers:[
        AppSerive
        // {
        //     provide:'PREFFIX',  //TODO DynamicConfigModule也存在PREFFIX 源码以这里为准 本地实现以DynamicConfigModule为准需要修改
        //     useValue:'preffix-pipe'
        // },{
        //     provide:APP_PIPE,
        //     useClass:MyPipe  // 全局管道的使用 这种写法支持 管道的依赖注入
        // },
        // {
        //     provide:APP_GUARD,
        //     useClass: AuthGuard  // 全局守卫的使用 这种写法支持 守卫的依赖注入 
        // },
        // {
        //     provide:APP_FILTER,
        //     useClass:CustomExceptionFilter
        // },
        // {
        //     provide:APP_INTERCEPTOR,
        //     useClass: Logger6Interceptor  // 全局拦截器的使用 这种写法支持 拦截器的依赖注入 
        // },
        // {
        //     provide:APP_INTERCEPTOR,
        //     useClass: Logger5Interceptor  // 全局拦截器的使用 这种写法支持 拦截器的依赖注入 
        // }
    ],
    exports:[AppSerive]

})

export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        // consumer
        // .apply(logger1)
        // .forRoutes(AppController)


        // .apply(logger2)
        // .forRoutes(App2Controller)

        // consumer
        // .apply(AuthMiddleware)
        // .forRoutes('*')


    }
} 