import {
  applyDecorators,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  LoggerService,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SerializeOptions,
  UseInterceptors,
  Logger,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto';
import { User } from 'src/shared/entities/user.entity';
import { UserService } from 'src/shared/services/user.service';
import { Result } from 'src/shared/vo/result';
import { UserVo } from 'src/shared/vo/user.vo';

// class-validator  class-transformer  ClassSerializerInterceptor
@Controller('api/users')
@SerializeOptions({
  strategy: 'exposeAll', // 'excludeAll' 包含还是排除类的所有属性。
})
@UseInterceptors(ClassSerializerInterceptor) // ‌ClassSerializerInterceptor‌是NestJS框架提供的一个拦截器，用于在控制器返回响应前自动转换响应对象中的属性。它能够将响应对象中的实体对象转换为普通的JavaScript对象，以便在响应中排除敏感或不必要的属性，增加数据的安全性‌
@ApiTags('用户')
export class UserController {
  private readonly logger = new Logger(UserController.name); // 内置的ConsoleLogger
  @Inject(WINSTON_MODULE_NEST_PROVIDER) // WINSTON_MODULE_NEST_PROVIDER 固定的token 由WinstonModule注入
  private readonly winstonLogger: LoggerService;
  constructor(
    private readonly userService: UserService,
    // private readonly loggerService: LoggerService
  ) {}

  @Get()
  @ApiFindAll()
  async findAll() {
    // [Nest] 进程号  - 时间戳                    日志级别 Context          message
    // [Nest] 95052  - 03/12/2025, 5:51:57 PM   ERROR   [UserController] 这是Nest内置的日志记录器
    // this.logger.error('这是Nest内置的日志记录器');
    this.winstonLogger.error('winstonLogger | 日志');
    // this.loggerService.error('这是Nest内置的日志记录器')
    return this.userService.findAll();
  }

  @Post()
  @ApiCreate()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('create', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // console.log('create',createUserDto)
    const result = await this.userService.findOne({ where: { id } });
    if (result) {
      // result包含password字段 如果想文档不显示该字段 则用 @ApiHideProperty() 装饰器
      // 如果想实际接口返回数据都不返回password 必须重新转换
      // 方法1 手动创建1个不含password的类并合并其他字段
      // let userVo = new UserVo()
      // userVo.username = result.username
      //...
      // 方法2 class-transformer
      return result;
    } else {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @ApiUpdate()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // console.log('create',createUserDto)
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiDelete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.delete(id);
    return result
      ? Result.success('删除用户成功')
      : new HttpException('用户未找到', HttpStatus.NOT_FOUND);
  }
}

function ApiFindAll() {
  return applyDecorators(
    ApiOperation({ summary: '获取所有的用户列表' }),
    ApiResponse({ status: 200, description: '成功返回用户列表', type: [User] }),
  );
}
function ApiFindOne() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID获取某个用户信息' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiResponse({ status: 200, description: '成功返回用户信息', type: User }),
    ApiResponse({ status: 404, description: '用户未找到' }),
  );
}
function ApiCreate() {
  return applyDecorators(
    ApiOperation({ summary: '创建新用户' }),
    ApiBearerAuth(),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({ status: 201, description: '用户创建成功', type: User }),
    ApiResponse({ status: 400, description: '请求参数错误' }),
  );
}
function ApiUpdate() {
  return applyDecorators(
    ApiOperation({ summary: '更新用户信息' }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({ status: 200, description: '用户信息更新成功', type: Result }),
    ApiResponse({ status: 400, description: '请求参数错误' }),
    ApiResponse({ status: 404, description: '用户未找到' }),
  );
}
function ApiDelete() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID删除用户' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiResponse({ status: 200, description: '用户删除成功', type: Result }),
    ApiResponse({ status: 404, description: '用户未找到' }),
  );
}
