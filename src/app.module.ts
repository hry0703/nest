import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
  I18nModule,
} from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // 默认语言
      loaderOptions: {
        // 加载器选项
        path: path.join(__dirname, '/i18n/'), // 路径
        watch: true, // 监听
      },
      resolvers: [
        new QueryResolver(['lang', 'l']), // url传递查询参数 字符串 /app?lang=zh /app?l=zh
        new HeaderResolver(['x-custom-lang']), // headers:{"x-custom-lang":"zh"}
        new CookieResolver(), // cookie x-custom-lang=zh
        AcceptLanguageResolver, // headers:{"accept-language":"zh"}
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
