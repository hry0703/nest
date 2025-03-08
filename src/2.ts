import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
    const users = [
        {firstName:'Timber',lastName:'Saw',age:25,email:'stName',isActive:true},
        {firstName:'Phantom',lastName:'Assassin',age:24,email:'PhanName',isActive:false},
    ]
    await AppDataSource.manager.insert(User,users)
    console.log('批量插入用户数组·');
    // 查询并计数
    const [allUsers,userCount] = await AppDataSource.manager.findAndCount(User)
    console.log(allUsers,userCount);
    const singleUser1 = await AppDataSource.manager.findOne(User,{
        where:{
            email:'stName'
        }
    })
    console.log('singleUser1',singleUser1);
    const singleUser2 = await AppDataSource.manager.findOneBy(User,{ email:'stName'})
    console.log('singleUser2',singleUser2);
    try {
        const userOrFail = await AppDataSource.manager.findOneOrFail(User,{where:{email:'xstName'} })
        console.log('找到用户',userOrFail);
    } catch (error) {
        console.log('未找到用户',error);
        
    }
    

}).catch(error => console.log(error))