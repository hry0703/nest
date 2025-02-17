import { Controller, Get,Post, Inject, HttpException, HttpStatus, UseFilters, Param, Query, Body} from "@nestjs/common";
// import {LoggerClassService, LoggerService,UseValueService,UseFactory } from "./logger.service";
import { CommonSerive } from "./common.service";
import { OtherSerive } from "./other.service";
import { AppSerive } from "./app.service";
import { ForbiddenException } from "./fobidden.exception";
import { BadRequestException,RequestTimeoutException } from "@nestjs/common";
import { CustomExceptionFilter } from "./custom-exception.filter";
import { ParseIntPipe,ParseFloatPipe,ParseBoolPipe,ParseArrayPipe,ParseUUIDPipe,ParseEnumPipe,DefaultValuePipe } from "@nestjs/common";
import { CustomPipe } from "./custom.pipe";
import { UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "./zod-validation.pipe";
import { CreateCatDto, createCatSchema } from "./create-cat.dto";
import { ClassValidationPipe } from "./class-validation.pipe";
import { CreateUserDto } from "./create-user.dto";
enum Roles {
    Admin ='Admin',
    VIP = 'VIP'
}
@Controller('app')
// @UseFilters(CustomExceptionFilter) // 异常过滤器可以设置为全局的 也可以设置为控制器级别的  以及方法级别的
// @UsePipes(new ZodValidationPipe(createCatSchema))
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

    @Get()
    index1(){
       return this.appSerive.getPrefix() + ':app'
    }

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

    @Get('exception')
    @UseFilters(CustomExceptionFilter)  // 异常过滤器可以设置为全局的 也可以设置为控制器级别的  以及方法级别的
    exception(){
        // 1 当异常是未识别的（既不是 HttpException 也不是继承自 HttpException 的类），内置的异常过滤器会生成以下默认的 JSON 响应：
        // throw new Error("exception"); // {"statusCode": 500,"message": "Internal server error"}


        // 2
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);  
        // {
        // "statusCode": 403,
        // "message": "Forbidden"
        // }

        // 3
        throw new HttpException({status:120,message:"123",errorCode:"E0001"},HttpStatus.FORBIDDEN)
        // {   
        //     status:120,
        //     message:"123",
        //     errorCode:"E0001"
        // }
    }


    @Get('custom')
    custom(){
        throw new ForbiddenException()
    }


    // @UseFilters(CustomExceptionFilter)  // 异常过滤器可以设置为全局的 也可以设置为控制器级别的  以及方法级别的
    @Get('bad-request')
    badRequest(){
        throw new BadRequestException('Something bad happended','Something error occur')
    }

    @Get('request-timeout')
    // @UseFilters(CustomExceptionFilter)  // 异常过滤器可以设置为全局的 也可以设置为控制器级别的  以及方法级别的
    requestTimeout(){
        throw new RequestTimeoutException('request-timeout','request-timeout')
    }


    @Get('number/:id')
    getNumber(@Param('id', ParseIntPipe) id:number){
        return ` The number is ${id}`
    }

    @Get('float/:value')
    getFloat(@Param('value', ParseFloatPipe) value:number){
        return ` The float is ${value}`
    }
    

    @Get('bool/:value')
    getBool(@Param('value', ParseBoolPipe) value:number){
        return ` The bool is ${value}`
    }
    

    @Get('array/:values')
    getArray(@Param('values',new ParseArrayPipe({items:String,separator:','})) values:string[]){
        console.log(values,);
        return ` The values are ${values}`
    }
    
    @Get('uuid/:id')
    getUUid(@Param('id',ParseUUIDPipe) id:string){
        return ` The UUId are ${id}`
    } 
    
    @Get('admin/:role')
    getRole(@Param('role',new ParseEnumPipe(Roles)) role:string){
        return ` The role is ${role}`
    }
    // http://localhost:3000/app/default?username=username    http://localhost:3000/app/default
    @Get('default')
    getDefault(@Query('username',new DefaultValuePipe("Guest")) username:string){
        return ` The username is ${username}`
    }

    @Get('custom/:value')
    getCustom(@Param('value',CustomPipe) value:string){
        return ` The value is ${value}`
    }


    @Post('cats')
    @UsePipes(new ZodValidationPipe(createCatSchema))
    async createCat(@Body() createCatDto:CreateCatDto){
        console.log('createCatDto',JSON.stringify(createCatDto));
        return 'This action adds a new cat'
    }

    @Post('create/user')
    // @UsePipes(new ClassValidationPipe()) // 可以设置为全局的 也可以设置为控制器级别的  以及方法级别的 
    // async createUser(@Body(new ClassValidationPipe()) createUserDto:CreateUserDto){
    async createUser(@Body() createUserDto:CreateUserDto){
        console.log('createUserDto',JSON.stringify(createUserDto));
        return 'This action adds a new user'
    }
}