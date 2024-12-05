import { Controller, Get,Post, Inject} from "@nestjs/common";
// import {LoggerClassService, LoggerService,UseValueService,UseFactory } from "./logger.service";
import { CommonSerive } from "./common.service";
import { OtherSerive } from "./other.service";
import { AppSerive } from "./app.service";

@Controller('app')
export class AppController {
    constructor(
        // private loggerClassService:LoggerClassService,
        // private loggerService:LoggerService,
        // @Inject('StringToken') private useValueService:UseValueService,
        // @Inject('FactoryToken') private UseFactory:UseFactory,

        // private commonSerive:CommonSerive
        // private otherSerive:OtherSerive
        private appSerive:AppSerive
    ){}
    // @Get()
    // index(args):string{
    //     // console.log(args,);
    //     this.loggerClassService.log('index')
    //     this.loggerService.log('index')
    //     this.useValueService.log('index')
    //     this.UseFactory.log('index')
    //     return 'hello';
    // }


    // @Get('/common')
    // common():string{
    //     this.commonSerive.log('common')
    //     return 'hello common';
    // }

    // @Get('/other')
    // common():string{
    //     this.otherSerive.log('common')
    //     return 'hello other';
    // }

    @Get('config')
    index(){
       return this.appSerive.getConfig()
    }
    
    @Post('config')
    post(){
       return 'post-cofing'
    }

    @Get('abcde')
    excludeRoute(){
       return 'abcde'
    }
    
}