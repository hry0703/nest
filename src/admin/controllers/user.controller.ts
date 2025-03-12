import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Render,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/shared/dtos/user.dto';
import { UserService } from 'src/shared/services/user.service';
import { AdminExceptionFilter } from '../filters/admi-exception-filter';

@UseFilters(AdminExceptionFilter)
@ApiTags('Admin')
@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @Render('user/user-list')
  async findAll() {
    const users = await this.userService.findAll();
    console.log('users', users);
    return { users };
  }

  @Get('create')
  @Render('user/user-form')
  async createFrom() {
    return { user: {} };
  }

  @Post()
  @Redirect('/admin/users')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);

    return { success: true };
  }
}
