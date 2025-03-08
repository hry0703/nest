import { AppDataSource } from "./data-source";
import { Profile } from "./entity/Profile";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
   const newUser = new User()
   newUser.firstName = 'Eden2'
   newUser.lastName = 'Huang2'
   newUser.age = 320
   newUser.email = '2@qq.com'
//    await AppDataSource.manager.save(newUser)
   const newProfile = new Profile()
   newProfile.bio = 'Eden2的个人介绍'
   newProfile.user = newUser
   await AppDataSource.manager.save(newProfile)

}).catch(error => console.log(error))