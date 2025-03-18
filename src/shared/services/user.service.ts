import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { MySQLBaseService } from './mysql-base.service';

@Injectable()
export class UserService extends MySQLBaseService<User> {
  constructor(
    // 一个User实体对应数据库中的一张表 也会对应一个UserRepository仓库
    @InjectRepository(User) protected repository: Repository<User>,
  ) {
    super(repository);
  }

  async findAll(keyword?: string) {
    const where = keyword
      ? [{ username: Like(`%${keyword}%`) }, { email: Like(`%${keyword}%`) }]
      : {};
    return this.repository.find({ where });
  }

  async findAllWithPagination(page: number, limit: number, keyword?: string) {
    const where = keyword
      ? [{ username: Like(`%${keyword}%`) }, { email: Like(`%${keyword}%`) }]
      : {};
    const [users, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, total };
  }
}
