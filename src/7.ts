import { AppDataSource } from "./data-source";
import { Order } from "./entity/order";
// import { Profile } from "./entity/Profile";
import { User } from "./entity/user";
// 查询至少买过一个商品的用户
AppDataSource.initialize().then(async connection => {

   const userRepository = await AppDataSource.getRepository(User)
    const users = await userRepository.createQueryBuilder('user')
    .where(qb=>{
        const subQuery = qb.subQuery().select('order.userId').from(Order,'order').getQuery()
        return `user.id in ${subQuery}`
    }).getMany()
    console.log('users',users);
    // SELECT `user`.`id` AS `user_id`, `user`.`firstName` AS `user_firstName`, `user`.`lastName` AS `user_lastName`, `user`.`age` 
// AS `user_age`, `user`.`email` AS `user_email`, `user`.`isActive` AS `user_isActive`, `user`.`createAt` AS `user_createAt`, `user`.`updateAt` AS `user_updateAt` FROM `user` `user` WHERE `user`.`id` in (SELECT `order`.`userId` FROM `order` `order`)

// WHERE user.id IN (SELECT order.userId FROM order)
// IN 是 SQL 中的一个操作符，用于检查一个值是否在一组值或子查询结果中。
// - (SELECT order.userId FROM order) 是一个子查询，它会返回所有订单表中的用户ID列表
// - user.id IN ... 表示检查 user 表中的 id 是否存在于这个列表中
// 这个条件的作用是筛选出那些在订单表中有记录的用户，也就是至少购买过一个商品的用户。

// 举个例子：
// - 假设订单表中有用户ID为1、2、3的订单记录
// - 那么子查询 (SELECT order.userId FROM order) 会返回 [1, 2, 3]
// - 然后 WHERE user.id IN [1, 2, 3] 会筛选出ID为1、2、3的用户
// 这比使用 JOIN 查询在某些情况下更加直观，特别是当你只关心"是否存在关联记录"而不需要关联记录的具体内容时。
}).finally(()=>process.exit(0)) // 关闭数据库连接