import {Controller, Get, UseGuards} from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { Roles } from './roles.decorator'
@Controller('accounts')
export class AccountController {
  @Get()
  @UseGuards(AuthGuard)
  @Roles('admin') //此装饰器的作用是给当前的index函数添加了角色数组的原数据  用来标明哪些角色可以访问此路由
  async index() {
    return 'this action will return all accounts'
  }
} 