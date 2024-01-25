import { NestFactory } from '@nestjs/core';

import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from "express-session"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  })
  app.use(session({secret:"xiaoman"}));
  await app.listen(3000);
}
bootstrap();

// app.module.ts 跟模块 用于处理其他类的引用
// app.controller.ts 常见功能是用来处理http请求和调用service层的处理方法 
// app.service.ts 封装通用的业务逻辑、与数据层的交互（例如数据库）、其他额外的三方请求