import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  Headers,
  HttpCode,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as svgCaptcha from 'svg-captcha';

@Controller({
  path: 'user',
  version: '1',
})
// @Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // restful风格接口
  //   @Post()
  //   create(@Body() createUserDto: CreateUserDto) {
  //     return this.userService.create(createUserDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.userService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.userService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //     return this.userService.update(+id, updateUserDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.userService.remove(+id);
  //   }

  // test---------------

  //   @Get()
  //   findAll(@Request() req) {
  //     console.log(req.query);
  //     return {
  //       code: 200,
  //       message: req.query.name,
  //     };
  //   }

  //   @Get()
  //   findAll(@Query() query) {
  //     console.log(query);
  //     return {
  //       code: 2001,
  //       message: query.name,
  //     };
  //   }

  //   @Post()
  //   create(@Body() body, @Headers() header) {
  //     console.log(body);
  //     return {
  //       code: 2001,
  //       message: body.name,
  //     };
  //   }

  //   @Get(':id')
  //   //   @HttpCode(200)
  //   findId(@Param('id') params, @Headers() header) {
  //     console.log(header);
  //     return {
  //       code: 2001,
  //       message: params,
  //     };
  //   }

  @Get('memberCode')
  queryMemberCode(@Query() query) {
    console.log('query', query);
    return {
      name: '会员名称1',
    };
  }

  @Get('code')
  createCaptcha(@Session() session, @Req() req, @Res() res) {
    // console.log('injectable', this.userService.findAll());
    // console.log('session', session);
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    // console.log(' captcha.text', captcha.text);
    req.session.code = captcha.text; //存储验证码记录到session
    // req.session.code = 'abcd'; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('create')
  createUser(@Req() req, @Body() body) {
    console.log(req.session.code, body.code);

    if (
      req.session.code.toLocaleLowerCase() === body?.code?.toLocaleLowerCase()
    ) {
      return {
        message: '验证码正确',
      };
    } else {
      return {
        message: '验证码错误',
      };
    }
  }
}
