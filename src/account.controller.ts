import {Controller, Get, UseGuards} from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthGuard2 } from './auth2.guard'
import { Roles } from './roles.decorator'
import { Roles2 } from './roles2.decorator'
@Controller('accounts')
export class AccountController {
  @Get()
  @UseGuards(AuthGuard)
  @Roles('admin') //此装饰器的作用是给当前的index函数添加了角色数组的原数据  用来标明哪些角色可以访问此路由 roles 'admin

//   @UseGuards(AuthGuard2)
//   @Roles2(['admin']) // 匿名的默认key(Roles2这个函数) ['admin']
  async index() {
    return 'this action will return all accounts'
  }
} 