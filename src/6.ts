import { AppDataSource } from "./data-source";
import { Order } from "./entity/order";
// import { Profile } from "./entity/Profile";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
//    const newUser = new User()
//    newUser.firstName = 'Eden2'
//    newUser.lastName = 'Huang2'
//    newUser.age = 320
//    newUser.email = '2@qq.com'
//    await AppDataSource.manager.save(newUser)
//    const newProfile = new Profile()
//    newProfile.bio = 'Eden2的个人介绍'
//    newProfile.user = newUser
//    await AppDataSource.manager.save(newProfile)

    const user1 = new User()
    user1.firstName = 'Eden3'
    user1.lastName = 'Huang3'
    user1.age = 320
    user1.email = '3@qq.com'
    user1.isActive = true
    await AppDataSource.manager.save(user1)
    const order1 = new Order()
    order1.product = '手机'
    order1.amount = 1000
    order1.user = user1
    await AppDataSource.manager.save(order1)
    const order2 = new Order()
    order2.product = 'Mac'
    order2.amount = 2000
    order2.user = user1
    await AppDataSource.manager.save(order2)
    const order3 = new Order()
    order3.product = '手机'
    order3.amount = 2000
    order3.user = user1
    await AppDataSource.manager.save(order3)
    const queryBuilder = AppDataSource.manager.createQueryBuilder(User,'user')
    const query = queryBuilder
    .select(['user.firstName'])
    .addSelect(['user.lastName'])
    .addSelect('SUM(order.amount)','totalAmount') // 汇总订单的总数量
    .innerJoin('user.orders','order')
    .where('user.isActive = :isActive',{isActive:true})
    .andWhere('order.product = :product',{product:'手机'})
    .groupBy('user.id') // 按用户的ID进行分组
    .orderBy('totalAmount','DESC') // 按订单的商品总数进行降序排序

    const result = await query.getRawMany()
    console.log('result',result);

//     SELECT `user`.`firstName` AS `user_firstName`, 
// `user`.`lastName` AS `user_lastName`,
//  SUM(`order`.`amount`) AS `totalAmount`
//   FROM `user` `user` INNER JOIN `order` `order` ON `order`.`userId`=`user`.`id`
//    WHERE `user`.`isActive` = 1 AND `order`.`product` = '手机' GROUP BY `user`.`id` ORDER BY totalAmount DESC 

    // result [
    // {
    //     user_firstName: 'Eden3',
    //     user_lastName: 'Huang3',
    //     totalAmount: '3000'
    // }
    // ]
    
    

}).finally(()=>process.exit(0)) // 关闭数据库连接