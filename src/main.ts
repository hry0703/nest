import { NestFactory } from '@nestjs/core';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from './common/response';
import { HttpFilter } from './common/filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    session({
      secret: 'hrysession',
      name: 'hry-session',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  app.useStaticAssets(join(__dirname, 'icons'), {
    prefix: '/xiaoman',
  });
  //   app.useGlobalInterceptors(new Response());
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('描述，。。。')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  // 允许跨域
  app.enableCors();
  await app.listen(3000);
}
bootstrap();

// app.module.ts 根模块 用于处理其他类的引用
// app.controller.ts 常见功能是用来处理http请求和调用service层的处理方法
// app.service.ts 封装通用的业务逻辑、与数据层的交互（例如数据库）、其他额外的三方请求
