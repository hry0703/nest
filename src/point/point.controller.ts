import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { UserService } from 'src/user/user.service';

@Controller('point')
export class PointController {
  constructor(
    private readonly pointService: PointService,
    private readonly userService: UserService,
  ) {}

  //   @Post()
  //   create(@Body() createPointDto: CreatePointDto) {
  //     return this.pointService.create(createPointDto);
  //   }

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
