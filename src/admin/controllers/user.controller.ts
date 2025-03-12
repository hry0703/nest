import { Controller, Get, Query, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/shared/services/user.service';

@ApiTags('Admin')
@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return { users };
  }
}
