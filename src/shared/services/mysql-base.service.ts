import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, ObjectLiteral } from 'typeorm';

@Injectable()
export abstract class MySQLBaseService<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}
  async findAll() {
    return this.repository.find();
  }
  async findOne(id: number) {
    return this.repository.findOneBy({ id } as any);
  }
}
