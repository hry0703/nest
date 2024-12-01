import {NestApplication} from './nest-application'
import { Logger } from "./logger";
export class  NestFactory {
    static async create(AppModule){
        //启动Nest应用
        Logger.log('Starting Nest application...','NestFactory');
        //创建Nest应用实例
        const app = new NestApplication(AppModule)
        //返回Nest应用实例
        return app;
    }
}