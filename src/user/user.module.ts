import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Logger } from 'src/middileware';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 支持对某个path拦截
    // consumer.apply(Logger).forRoutes('v1/user/memberCode');
    // 指定 拦截的方法 比如拦截GET  POST 等 forRoutes 使用对象配置
    consumer
      .apply(Logger)
      .forRoutes({ path: 'v1/user/memberCode', method: RequestMethod.GET });
    // 支持对整个Controller拦截
    // consumer.apply(Logger).forRoutes(UserController);
  }
}
