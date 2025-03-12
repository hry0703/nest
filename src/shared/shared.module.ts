import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './services/configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { IsUserNameUniqueConstraint } from './validators/user-validator';

@Global()
@Module({
  providers: [IsUserNameUniqueConstraint,ConfigurationService, UserService],
  exports: [IsUserNameUniqueConstraint,ConfigurationService, UserService],
  imports: [
    // 从默认位置（项目根目录）加载并解析 .env 文件
    ConfigModule.forRoot({
      isGlobal: true, // 表示全局使用模块
      envFilePath: '.env', // 配置文件位置 默认是.env
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        return {
          type: 'mysql', // 数据库类型
          ...configurationService.mysqlConfig,
          autoLoadEntities: true, // 自动加载所有的实体 一个实体对应数据库的一张表
          synchronize: true, // 保持代码和数据库的一致
          logging: true, // 打印内部真正执行的sql语句
        };
      },
    }),

    TypeOrmModule.forFeature([User]), // 注册实体
  ],
})
export class SharedModule {}
