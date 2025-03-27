import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './services/configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { IsUserNameUniqueConstraint } from './validators/user-validator';
import { UtilityService } from './services/utility.service';
import { Role } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { Access } from './entities/access.entity';
import { AccessService } from './services/access.service';
import { Tag } from './entities/tag.entity';
import { TagService } from './services/tag.service';
import { Article } from './entities/article.entity';
import { ArticleService } from './services/article.service';
import { Category } from './entities/category.entity';
import { CategoryService } from './services/category.service';
import { CosService } from './services/cos.service';
import { NotificationService } from './services/notification.service';
import { MailService } from './services/mail.service';
import { WordExportService } from './services/word-export.service';
import { PptExportService } from './services/ppt-export.ervice';
import { ExcelExportService } from './services/excel-export.service';
import { SettingService } from './services/setting.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { DashboardService } from './services/dashboard.service';
import { WeatherService } from './services/weather.service';
@Global()
@Module({
  providers: [
    IsUserNameUniqueConstraint,
    ConfigurationService,
    UserService,
    UtilityService,
    RoleService,
    AccessService,
    TagService,
    ArticleService,
    CategoryService,
    CosService,
    NotificationService,
    MailService,
    WordExportService,
    PptExportService,
    ExcelExportService,
    SettingService,
    DashboardService,
    WeatherService,
  ],
  exports: [
    IsUserNameUniqueConstraint,
    ConfigurationService,
    UserService,
    UtilityService,
    RoleService,
    AccessService,
    TagService,
    ArticleService,
    CategoryService,
    CosService,
    NotificationService,
    MailService,
    WordExportService,
    PptExportService,
    ExcelExportService,
    SettingService,
    DashboardService,
    WeatherService,
  ],
  imports: [
    // 从默认位置（项目根目录）加载并解析 .env 文件
    ConfigModule.forRoot({
      isGlobal: true, // 表示全局使用模块
      envFilePath: '.env', // 配置文件位置 默认是.env
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        return {
          uri: configurationService.mongodbConfig.uri,
        };
      },
    }),
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]), // 注册操作数据库模型的名称和对应的schema
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        return {
          type: 'mysql', // 数据库类型
          ...configurationService.mysqlConfig,
          autoLoadEntities: true, // 自动加载所有的实体 一个实体对应数据库的一张表
          synchronize: true, // 保持代码和数据库的一致
          logging: false, // 打印内部真正执行的sql语句
        };
      },
    }),
    TypeOrmModule.forFeature([User, Role, Access, Tag, Article, Category]), // 注册实体
  ],
})
export class SharedModule {}
