import { Controller, Get, Query, Render } from '@nestjs/common';
import { UserService } from 'src/shared/services/user.service';

@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return { users };
  }

  @Get('one')
  async index(@Query('id') id: number) {
    const user = await this.userService.findOne(id);
    return { user };
  }
}
