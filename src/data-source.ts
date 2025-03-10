import { DataSource } from 'typeorm'
import { Role } from './entity/role'
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin123456',
  database: 'orm',
  synchronize: true, // 是否自动同步实体与数据库的表结构 开发时为true 生产时为false
  logging: true, // 是否打印sql日志
  entities: [Role], // 实体类数组 指定的是要用到的实体类
  migrations: ['./src/migrations/*.ts'], // 迁移类数组
  connectorPackage:'mysql2'
})