import { Controller, Get} from "@nestjs/common";
// import {LoggerClassService, LoggerService,UseValueService,UseFactory } from "./logger.service";
import { AppSerive } from "./app.service";

@Controller('app2')
// @UseFilters(CustomExceptionFilter) // 异常过滤器可以设置为全局的 也可以设置为控制器级别的  以及方法级别的
export class App2Controller {
    constructor(
        private appSerive:AppSerive
    ){}

    @Get()
    index(){
       return this.appSerive.getPrefix() + ':app2'
    }
}