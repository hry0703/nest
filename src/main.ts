import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import {NestExpressApplication} from '@nestjs/platform-express';
import { join } from 'path';
import {engine} from 'express-handlebars';
import { Transform } from 'class-transformer';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
 
    // NestExpressApplication 表示 底层用的是express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 配置静态文件根目录 该目录下文件可直接访问  http://localhost:3000/1.txt
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 配置模版根目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 配置handlebars模版引擎
  app.engine('hbs',engine({
    extname:'.hbs',
    runtimeOptions:{
      allowProtoPropertiesByDefault:true, // 允许使用原型prototype上的属性
      allowProtoMethodsByDefault:true // 允许使用原型prototype上的方法
    }
    // defaultLayout:'main',
    // layoutsDir:join(__dirname,'..','views/layouts'),
    // partialsDir:join(__dirname,'..','views/partials')
  }));
  // 设置模版引擎为handlebars
  app.set('view engine','hbs')


  app.use(cookieParser());
  app.use(session({
    secret: 'secret-key',
    resave:true,
    saveUninitialized:true,
    cookie:{
      maxAge:1000* 60 * 60 * 24 * 7 // 7天
    }
  }));


  app.useGlobalPipes(new ValidationPipe({transform:true})); // transform 把普通对象转为类的实例
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
