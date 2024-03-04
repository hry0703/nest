import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

@Injectable()
export class PointService {
  create(createPointDto: CreatePointDto) {
    console.log('post-createPointDto', createPointDto);
    return createPointDto;
  }

  findPointAll() {
    return `Point Module:This action returns all point`;
  }

  findOne(id: number) {
    return `This action returns a #${id} point`;
  }

  update(id: number, updatePointDto: UpdatePointDto) {
    return `This action updates a #${id} point`;
  }

  remove(id: number) {
    return `This action removes a #${id} point`;
  }
}
