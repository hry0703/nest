import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

// Entity 实体会映射为数据库中的一张表
@Entity()
export class User {
  @PrimaryGeneratedColumn() // 自增的主键
  id: number;

  @ApiProperty({ description: '用户名称', example: 'uuser_001' })
  @Column({ length: 50, unique: true })
  username: string;

  //   @ApiProperty({description:'密码',example:'123456'})
  @Column()
  @ApiHideProperty() // 表示这是一个隐藏字段不会出现在swagger文档中
  @Exclude() // 表示在使用class-transformer拦截器时 排除掉这个字段 使其不展示在最终的序列化结果里
  password: string;

  @ApiProperty({ description: '手机号', example: '12345612345' })
  @Column({ length: 15, nullable: true })
  @Transform(({ value }: any) =>
    value?.replace(/(\d{3})(\d{3})(\d{4})/, '$1****$3'),
  )
  phone: string;

  @Expose() // 向外暴露一个不存在属性 数据库中没有的
  @ApiProperty({ description: '联系方式', example: '邮箱：1@qq.com' })
  get contact(): string {
    return `邮箱：${this.email}`;
  }

  @ApiProperty({ description: '邮箱', example: '1@qq.com' })
  @Column({ length: 100, nullable: true })
  email: string;

  @ApiProperty({ description: '状态', example: 1 })
  @Column({ default: 1 }) // 是否生效 0 表示无效 1 表示有效
  status: number;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ApiProperty({ description: '是否超级管理员', example: true })
  @Column({ default: false }) // 是否超级管理员
  is_super: boolean;

  @ApiProperty({ description: '排序', example: 100 })
  @Column({ default: 100 }) // 排序编号
  sort: number;

  @ApiProperty({ description: '创建时间', example: '' })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间', example: '' })
  updatedAt: Date;
}
