import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
   // 获取User实体的存储仓库
   const userRepository = AppDataSource.getRepository(User)
   const user = new User()
    user.firstName = "hry"
    user.lastName = "huang"
    user.age = 12
    user.email = '12703322@qq.com'
    user.isActive = false
    await userRepository.save(user)
    const users = await userRepository.find()
    console.log('users',users);
    const findUser = await userRepository.findOne({where:{id:5}})
    console.log('user',findUser);
    
}).catch(error => console.log(error))