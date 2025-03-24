import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Redirect,
  Render,
  UseFilters,
  Headers,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRolesDto,
} from 'src/shared/dto/user.dto';
import { UserService } from 'src/shared/services/user.service';
import { AdminExceptionFilter } from '../filters/admin-exception-filter';
import { UtilityService } from 'src/shared/services/utility.service';
import { query, Response } from 'express';
import { ParseOptionalIntPipe } from 'src/shared/pipes/parse-optional-int.pipe';
import { RoleService } from 'src/shared/services/role.service';
@UseFilters(AdminExceptionFilter)
@ApiTags('Admin')
@Controller('admin/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  @Render('user/user-list')
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
    @Query('limit', new ParseOptionalIntPipe(10)) limit: number,
  ) {
    const { users, total } = await this.userService.findAllWithPagination(
      page,
      limit,
      keyword,
    );
    const pageCount = Math.ceil(total / limit);
    const roles = await this.roleService.findAll();
    return { users, keyword, page, limit, pageCount, roles };
  }

  @Get('create')
  @Render('user/user-form')
  async createFrom() {
    return { user: {} };
  }

  @Post()
  @Redirect('/admin/users')
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      createUserDto.password = await this.utilityService.hashPassword(
        createUserDto.password,
      );
    }
    await this.userService.create(createUserDto);
    return { success: true };
  }

  @Get(':id/edit')
  @Render('user/user-form')
  async editFrom(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    return { user };
  }

  @Put(':id')
  //   @Redirect('/admin/users')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('accept') accept: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.utilityService.hashPassword(
        updateUserDto.password,
      );
    } else {
      delete updateUserDto.password;
    }
    await this.userService.update(id, updateUserDto);
    if (accept === 'application/json') {
      return { success: true }; // 使用Res装饰器则返回需要手动写 不想重写的话 在Res中添加passthrough：true
      // return res.json({ success: true }); // 使用Res装饰器则返回需要手动写
    } else {
      return res.redirect('/admin/users');
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return { success: true };
  }

  @Get(':id')
  async detail(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Headers('accept') accept: string,
  ) {
    const user = await this.userService.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    if (accept === 'application/json') {

      res.json({ user });
    } else {
      res.render('user/user-detail', { user });
    }
  }

  @Put(':id/roles')
  //   @Redirect('/admin/users')
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    await this.userService.updateRoles(id, updateUserRolesDto);
    return { success: true };
  }
}
