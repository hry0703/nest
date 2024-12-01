import { Controller,
    Get,Post,Redirect,HttpCode,Header,
    Req,Request,Query,Headers,Session,Ip,Param,Body,Response,Res,Next,
} from '@nestjs/common';
import { Request as ExpressRequest,Response as ExpressResponse } from 'express';
import { User } from 'src/user.decorator';
@Controller('users')
export class UserController {
    @Get('req')
    handleRequest(@Req() req:ExpressRequest,age:number,@Request() request:ExpressRequest){
        console.log('url',req.url);
        console.log('age',age);
        console.log('method',request.method);
        return 'handleRequest'
    }

    @Get('query')
    handleQuery(@Query() query:any,@Query('id') id:string){
        console.log('query',query);
        console.log('id',id);
        return `query id:${id}`
    }

    @Get('headers')
    handleHeaders(@Headers() headers:any,@Headers('accept') accept:string){
        console.log('headers',headers);
        console.log('accept',accept);
        return `accept:${accept}`
    }

    @Get('session')
    // handleSession(@Session() session:any,@Session('pageView') pageView:string){
    handleSession(@Session() session:any,@Session() pageView:string){
        console.log('session',session);
        console.log('pageView',pageView);
        if(session.pageView){
            session.pageView++
        }else {
            session.pageView = 1
        }
        return `pageView:${pageView}`
    }

    @Get('ip')
    handleIp(@Ip() ip:any){
        console.log('ip',ip);
        return `ip:${ip}`
    }

    @Get(':username/info/:age')
    getUserNameInfo(@Param() params,@Param('username') username:string,@Param('age') age:string){
        console.log('params',params);
        console.log('username',username);
        console.log('age',age);
        return `handleRequest:${JSON.stringify(params)}`
    }

    @Get('star/ab*de')
    hadnleWildCard(){
        return `hadnleWildCard`
    }


    @Post('create')
    @HttpCode(200)
    @Header('Cache-Control','none') // 向客户端发送一个响应头
    @Header('key1','val1') // 向客户端发送一个响应头
    @Header('key2','val2') // 向客户端发送一个响应头
    createUser(@Body() createUserDto,@Body('userName') userName:string){
        console.log('createUserDto',createUserDto);
        console.log('userName',userName);
        return `user created`
    }


    @Get('response')
    response(@Response() response:ExpressResponse){
        console.log('response',response);
        response.send('response321')
        // return `response`
    }
    

    @Get('passthrough')
    passthrough(@Res() res:ExpressResponse,@Response({passthrough:true}) response:ExpressResponse){
        // 但是有些接口我只想添加个响应头，仅此而已 我不想负责响应体的发送 
        response.setHeader('key','value')
        // 还是想返回一个值让Nest帮我们进行发送响应体的操作
        return `passthrough`
    }

    @Get('next')
    nest(@Next() next){
        console.log('next',next);
        next()
        // return `hadnleWildCard`
    }


    @Get('redirect')
    @Redirect('/users/req',302)
    hadnleRedirect(){
       
    }

    @Get('redirect2')
    hadnleRedirect2(@Query('version') version){
       return {url:`http://localhost:3000/${version}`,statusCode:302}
    }


    @Get('custom')
    customerParamDecorator(@User('name') user){
       return user
    }


}

/***
 * 在使用Nest.js的时候，一般来说一个实体会定义二个类型，一个是dto，一个是interface
 * dto 客户端向服务器提交的数据对象，比如说当用户注册的时候(用户名，密码}
 * 然后服务器端一般会获取此dto，然后保存到数据库中，保存的时候可能会还加入一些默认值，时间戳，对密码加密
 * 还可能会过滤掉某些字段，比如注册的时候密码和确认密码，但是保存的时候只保存密码
 * 数据库里保存的数据类型一般会定义为一个interface
 * userDto{用户名，密码，确认密码)
 * userInterface(用户名，密码，创建时间，更新时间)
 * 
 */