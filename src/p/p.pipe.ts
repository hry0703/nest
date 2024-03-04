import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class PPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const DTO = plainToInstance(metadata.metatype, value);
    console.log('transform', DTO);
    const errors = await validate(DTO);
    if (errors.length > 0) {
      console.log('errors', errors);
      return new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
