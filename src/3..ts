import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
    // const resuls = await AppDataSource.query('select * from user')
    // console.log('resuls',resuls);
    // 创建一个针对User实体的查询构建器 并将改 实体命名为user
    const queryBuilder = AppDataSource.createQueryBuilder(User,'user')
    // 选择查询中返回的字段 select user.id,user.firstName,user.lastName,user.age from user
    queryBuilder.select(['user.id','user.firstName','user.lastName','user.age'])
    // 添加更多的字段
    queryBuilder.addSelect(['user.email','user.isActive'])
    // 指定查询的主表
    // queryBuilder.from(User,'user') // 可以省略
    // 通过where添加查询条件
    queryBuilder.where('user.id = :id',{id:2})
    // 还可以添加额外的条件
    // queryBuilder.andWhere('user.isActive = :isActive',{isActive:true})
    // 指定要返回一条还是多条
    const user = await queryBuilder.getOne()
    const users = await queryBuilder.getMany()
    console.log('user',user);
    console.log('users',users);

    // query: SELECT `user`.`id` AS `user_id`, `user`.`firstName` AS `user_firstName`, `user`.`lastName` AS `user_lastName`, `user`.`age` AS `user_age`, `user`.`email` AS `user_email`, `user`.`isActive` AS `user_isActive` FROM `user` `user` WHERE `user`.`id` = ? -- PARAMETERS: [2]
    // query: SELECT `user`.`id` AS `user_id`, `user`.`firstName` AS `user_firstName`, `user`.`lastName` AS `user_lastName`, `user`.`age` AS `user_age`, `user`.`email` AS `user_email`, `user`.`isActive` AS `user_isActive` FROM `user` `user` WHERE `user`.`id` = ? -- PARAMETERS: [2]
    
    // 删除
    await queryBuilder.delete().from(User).where('id = :id',{id:2}).execute()

}).catch(error => console.log(error))