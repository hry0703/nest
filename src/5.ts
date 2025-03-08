import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
//初始化数据库连接
AppDataSource.initialize().then(async connection => {
    // const resuls = await AppDataSource.query('select * from user')
    // console.log('resuls',resuls);
    // 创建一个针对User实体的查询构建器 并将改 实体命名为user
    const queryBuilder = AppDataSource.createQueryBuilder()
    // 插入两条数据
    // await queryBuilder.insert().into(User).values([{
    //     firstName:'ber',
    //     lastName:'Saw',
    //     age:25,
    //     email:'x',
    //     isActive:true
    // },{
    //    firstName:'Tr',
    //     lastName:'Saw',
    //     age:25,
    //     email:'q',
    //     isActive:true  
    // }]).execute()


    const results = await queryBuilder.select('user').from(User,'user').where('user.id > :id',{id:2}).getMany()
    console.log('results',results);

    const res = await queryBuilder.update(User).set({
        firstName:'xxx',
        lastName:'Sttaw',
        age:250,
        email:'qqq',
        isActive:true
    }).where('user.id = :id',{id:2}).execute()
     console.log('res',res);

     await queryBuilder.delete().from(User).where('user.id = :id',{id:5}).execute()
    

}).catch(error => console.log(error))