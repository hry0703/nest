import { AppDataSource } from "./data-source";
// import { Category } from "./entity/category";
import { Role } from "./entity/role";
// import { Order } from "./entity/order";
// import { Profile } from "./entity/Profile";
// import { User } from "./entity/user";

AppDataSource.initialize().then(async connection => {
    console.log('initialize');
    const role = new Role()
    role.name = 'Admin'
    await AppDataSource.manager.save(role)
})
.catch(error => console.log(error))
.finally(()=>process.exit(0)) // 关闭数据库连接