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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path: 'user',
  version: '1',
})
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

  @Get()
  findAll(@Query() query) {
    console.log(query);
    return {
      code: 2001,
      message: query.name,
    };
  }

  @Post()
  create(@Body() body, @Headers() header) {
    console.log(body);
    return {
      code: 2001,
      message: body.name,
    };
  }

  @Get(':id')
//   @HttpCode(200)
  findId(@Param('id') params, @Headers() header) {
    console.log(header);
    return {
      code: 2001,
      message: params,
    };
  }
}
