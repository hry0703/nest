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
@Module({
    // imports:[CommonModule,OtherModule],
    imports:[DynamicConfigModule.forRoot('-hry1122')],
    // controllers:[AppController, UserController],
    controllers:[AppController],
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
    providers:[AppSerive],
    exports:[AppSerive]

})

export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        //要针对/config路径应用loggerMiddleware中间件
        consumer
        .apply(loggerMiddleware)
        // .forRoutes({path:'config',method:RequestMethod.GET}); // 
        // .forRoutes('ab*de'); // 
        .forRoutes(AppController) // 
        .exclude({path:'app/config',method:RequestMethod.GET})
        // forRoutes 和 exclude 的顺序不影响结果 因为请求是异步的 请求发起时 forRoutes和exclude已经执行完毕
    }
} 