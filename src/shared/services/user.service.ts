import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { MySQLBaseService } from './mysql-base.service';

@Injectable()
export class UserService extends MySQLBaseService<User> {
  constructor(
    // 一个User实体对应数据库中的一张表 也会对应一个UserRepository仓库
    @InjectRepository(User) protected repository: Repository<User>,
  ) {
    super(repository);
  }
}
