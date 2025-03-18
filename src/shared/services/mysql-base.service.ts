import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, ObjectLiteral, FindOneOptions } from 'typeorm';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
@Injectable()
export abstract class MySQLBaseService<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}

  async findAll() {
    return this.repository.find();
  }

  async findOne(options: FindOneOptions<T>) {
    return this.repository.findOne(options);
  }

  async create(createUserDto: DeepPartial<T>) {
    const entity = await this.repository.create(createUserDto);
    return await this.repository.save(entity);

    // repository.create 并不是保存用户数据的意思 而是创建一个新的实体 不会操作数据库
    // repository.save 才是保存用户数据的意思
    // insert 插入 update 更新 delete 删除 save 保存并更新
  }

  async update(id: number, updateUserDto: QueryDeepPartialEntity<T>) {
    const result = await this.repository.update(id, updateUserDto);
    if (result.affected) {
      return { success: true, message: '更新用户成功' };
    } else {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    if (result.affected) {
      return { success: true, message: '删除用户成功' };
    } else {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    }
  }

  //
}
