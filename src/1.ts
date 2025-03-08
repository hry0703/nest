import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    user.email = '12703322@qq.com'
    user.isActive = true
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)
    // 查询一个用户
    const findUser = await AppDataSource.manager.findOne(User,{
        where:{
           id: user.id
        }
    })
    if(findUser){
        findUser.age = 28
        await AppDataSource.manager.save(findUser)
        console.log("用户已更新",findUser)
    }
    if(findUser){
        await AppDataSource.manager.remove(findUser)
        console.log("用户已删除",findUser)
    }
}).catch(error => console.log(error))