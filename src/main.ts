import { NestFactory  } from "@nestjs/core";
import {AppModule} from './app.module';
import session from 'express-session'
import { loggerFunction } from './logger-function.middleware';
import {CustomExceptionFilter } from './custom-exception.filter'
import { ValidationPipe } from "@nestjs/common";
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 异常过滤器可以设置为全局的 也可以设置为控制器级别的 以及方法级别的
    // app.useGlobalFilters(new CustomExceptionFilter())

    // 使用全局管道
    // app.useGlobalPipes(new ValidationPipe()) // 这种方式无法依赖注入
    // 使用全局守卫
    // app.useGlobalGuards(new AuthGuard2()) // 这种方式无法依赖注入
    app.use(session({
        secret:'your-secret-key', // 用于加密会话的密钥
        resave:true,// 在每次请求结束后是否强制保存会话，即使它没有改变
        saveUninitialized:false,// 是否保存未初始化的会话
        cookie:{maxAge:1000*60*60*24}// 定义会话的cookie配置 设置cookie的最大存活时间是一天
    }))
    // app.use(loggerFunction) // 这样可以注册全局中间件 可以绑定到注册的每个路由上 但是无法依赖注入 因为需要module中的providers 这里没有
    await app.listen(3000)
    
} 
bootstrap()