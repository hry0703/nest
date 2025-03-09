import { AppDataSource } from "./data-source";
import { Order } from "./entity/order";
import { Role } from "./entity/role";
// import { Profile } from "./entity/Profile";
import { User } from "./entity/user";

AppDataSource.initialize().then(async connection => {
    const userRepository = AppDataSource.getRepository(User)
    const roleRepository = AppDataSource.getRepository(Role)

    const role1 = new Role()
    role1.name = 'admin'
    await roleRepository.save(role1)  // 若user实体中roles列设置cascade:true 则可以直接保存role1、role2 不需要再做这步手动保存role1、role2

    const role2 = new Role()
    role2.name = 'User'
    await roleRepository.save(role2)


    const user1 = new User()
    user1.firstName = 'Eden'
    user1.lastName = 'Huang'
    user1.age = 32
    user1.email = '1@qq.com'
    user1.isActive = true
    user1.roles = [role1,role2]
    await userRepository.save(user1)

}).finally(()=>process.exit(0)) // 关闭数据库连接