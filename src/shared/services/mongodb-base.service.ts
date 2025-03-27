import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
@Injectable()
export abstract class MongodbBaseService<T, C, U> {
  constructor(protected readonly model: Model<T>) {}
  async findAll() {
    return await this.model.find();
  }
  async findOne(id: string) {
    return await this.model.findById(id);
  }
  async create(createDto: C) {
    const createdEntity = new this.model(createDto);
    await createdEntity.save();
    return createdEntity;
  }
  async update(id: string, updateDto: U) {
    // 根据id查找文档 如果存在则用updateDto更新 否则创建
    await this.model.findByIdAndUpdate(id, updateDto as any, { new: true });
  }
  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
  }
}
