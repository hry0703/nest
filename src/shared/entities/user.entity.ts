import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Entity 实体会映射为数据库中的一张表
@Entity()
export class User {
  @PrimaryGeneratedColumn() // 自增的主键
  id: number;
  @Column({ length: 50, unique: true })
  username: string;
  @Column()
  password: string;
  @Column({ length: 15, nullable: true })
  mobile: string;
  @Column({ length: 100, nullable: true })
  email: string;
  @Column({ default: 1 }) // 是否生效 0 表示无效 1 表示有效
  status: number;
  @Column({ default: false }) // 是否超级管理员
  is_super: boolean;
  @Column({ default: 100 }) // 排序编号
  sort: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
