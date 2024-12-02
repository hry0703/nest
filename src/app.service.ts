import { Inject, Injectable } from "@nestjs/common";
import { Config } from "./dynamicConfig.module";

@Injectable()
export class AppSerive {
    constructor(
        @Inject('PREFIX') private readonly prefix:string,
        @Inject('CONFIG') private readonly config:Config,
    ){

    }

    getConfig(){
        return this.prefix + this.config.apiKey
    }

}