import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './logger/logger.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  AcceptLanguageResolver,
  QueryResolver,
  I18nModule,
  CookieResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import methodOverride from './shared/middleware/methodOverride';
const { combine, timestamp, printf } = winston.format;
@Module({
  imports: [
    EventEmitterModule.forRoot({
        wildcard: true, //  启用通配符功能 允许 使用通配符来订阅事件
        delimiter: '.', //  设置事件名的分隔符 这是使用.作为分隔符 article.xxx article.*
        global:true // 设置为全局模块 意味着所有的模块都可以共享一个事件发射器的实例
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'), // 静态文件根目录
      serveRoot: '/uploads',}), // 访问此静态文件时需要添加的前缀
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']), // url传递查询字符串 /app?lang=zh 或者 /app?l=zh
        AcceptLanguageResolver, // headers:{"accept-language":"zh-CN,zh;q=0.9"}
        // new HeaderResolver(['x-custom-lang']), // headers:{"x-custom-lang":"zh-CN"}
        // new CookieResolver(), // cookie:x-custom-lang=zh
      ],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: combine(
            timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
            printf(({ level, message, timestamp, context }) => {
              return ` [Nest] ${(process as any).pid}  - ${timestamp} ${level}  [${context}]  ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    LoggerModule,
    SharedModule,
    AdminModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(methodOverride).forRoutes('*');
  }
}
