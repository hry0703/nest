import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
    constructor(private configService:ConfigService) {}

    get mysqlHost():string {
        return this.configService.get<string>('MYSQL_HOST')??''
    }
    get mysqlProt():string {
        return this.configService.get<string>('MYSQL_PORT')??''
    }
    get mysqlDB():string {
        return this.configService.get<string>('MYSQL_DB')??''
    }
    get mysqlUser():string {
        return this.configService.get<string>('MYSQL_USER')??''
    }
    get mysqlPassword():string {
        return this.configService.get<string>('MYSQL_PASSWORD')??''
    }
    get mysqlConfig():any {
        return {
            host:this.mysqlHost,
            port:parseInt(this.mysqlProt),
            username:this.mysqlUser,
            password:this.mysqlPassword,
            database:this.mysqlDB
        }
    }
}
