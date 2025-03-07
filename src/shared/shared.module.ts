import { Module } from '@nestjs/common';
import  {ConfigModule} from '@nestjs/config'
import { ConfigurationService } from './services/configuration.services';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports:[
        // 从默认位置（项目根目录）加载并解析 .env 文件
        ConfigModule.forRoot({
            isGlobal:true, // 表示全局使用模块
            envFilePath:'.env' // 配置文件位置 默认是.env
        }),
        TypeOrmModule.forRootAsync({
            inject:[ConfigurationService],
            useFactory:(configurationService:ConfigurationService)=>{
                return {
                    type:'mysql', // 数据库类型
                    ...configurationService.mysqlConfig,
                    autoLoadEntities:true, // 自动加载实体
                    synchronize:true, // 自动创建数据库表
                    logging:true // 打印日志
                }
            }
        })
    ],
    providers:[ConfigurationService],
    exports:[ConfigurationService]
})
export class SharedModule {}
