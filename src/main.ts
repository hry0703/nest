import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import {NestExpressApplication} from '@nestjs/platform-express';
import { join } from 'path';
import {engine} from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './my-logger';
import { ExtendedConsoleLogger } from './extended-console-logger';
async function bootstrap() {
    // NestExpressApplication 表示 底层用的是express
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    // logger:false // 禁用日志
    // logger:['error','warn'] // 启用特定的体制记录级别 只在这种指定类型的级别的日志才打印
    // logger:console // 自定义log方法
    // logger:new MyLogger() // 自定义log方法
    // logger:new ExtendedConsoleLogger() // 自定义log方法
    // bufferLogs:true,// 日志缓存 在useLogger完成后打印缓存的日志
  }); 
  console.log('app.get(LOGGER_CONFIG)',app.get('LOGGER_CONFIG')); // 获取provide_token对应的服务 即注入的依赖
//   app.useLogger(app.get(MyLogger)) // 和 bufferLogs:true 搭配使用
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
    secret: 'secret-key', //用于签名 session ID 的密钥
    resave:true,// 是否在每次请求时保存 session，即使 session 没有更改
    saveUninitialized:true,// 是否为尚未初始化的 session 创建新的 session 对象
    cookie:{ // 设置 cookie 的属性
      maxAge:1000* 60 * 60 * 24 * 7 // 7天
    }
  }));
  app.useGlobalPipes(new ValidationPipe({transform:true})); // transform 把普通对象转为类的实例

 // 创建一个新的documentBuild实例 用于配置swagger文档
  const cofig = new DocumentBuilder()
  .setTitle('CMS API')
  .setDescription('CMS API Description')
  .setVersion('1.0')
  .addTag('CMS')
  .addCookieAuth('connect.sid') // 添加cookie认证方式 cookie的名称为connect.sid
  .addBearerAuth({ // 添加Bearer认证方式 在请求头里添加Authorization:Bearer token
    type:'http',
    scheme:'bearer'
  })
  .build()
  // 使用配置对象创建Swagger文档
  const document = SwaggerModule.createDocument(app,cofig)
  // 设置Swagger模块的路径和文档对象 将Swagger绑定到api-doc路径上
  SwaggerModule.setup('api-doc',app,document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
