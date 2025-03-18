import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform<string, number> {
  constructor(protected readonly defaultValue: number) {}
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      return this.defaultValue;
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed ${value} is not an integer`,
      );
    }
    return val;
  }
}
