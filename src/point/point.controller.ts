import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { UserService } from 'src/user/user.service';
import * as uuid from 'uuid';
import { PPipe } from 'src/p/p.pipe';
import { RoleGuard } from '../role/role.guard';
import { ApiTags } from '@nestjs/swagger';
console.log(uuid.v4());
@Controller('point')
@UseGuards(RoleGuard)
@ApiTags('积分')
export class PointController {
  constructor(
    private readonly pointService: PointService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body(PPipe) createPointDto: CreatePointDto) {
    return this.pointService.create(createPointDto);
  }

  @Get()
  @SetMetadata('role', ['admin'])
  getRile(@Param('id', ParseUUIDPipe) id: string): string {
    console.log('id', id, typeof id);
    return '获取id：' + id;
  }

  //  ParseIntPipe  转成int
  //  ParseUUIDPipe  校验是否是uuid
  @Get(':id')
  getHello(@Param('id', ParseUUIDPipe) id: string): string {
    console.log('id', id, typeof id);
    return '获取id：' + id;
  }

  @Get('all')
  findAll() {
    return this.pointService.findPointAll();
  }

  @Get('user')
  findUserPointAll() {
    return this.userService.findAll();
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.pointService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
  //     return this.pointService.update(+id, updatePointDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.pointService.remove(+id);
  //   }
}
