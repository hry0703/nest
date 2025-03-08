import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./Profile";
// 使用Enetity装饰器来装饰实体类 name属性指定表名 不指定则默认是类名的小写
@Entity({name:'user'}) // 一个实体对应数据库中的一张表
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:50})
    firstName: string;

    @Column({length:50})
    lastName: string;

    @Column({type:'int'})
    age: number;

    @Column({nullable:true,unique:true})
    email: string;

    @Column({default:false})
    isActive: boolean;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
    
    @OneToOne(()=>Profile,(profile)=>profile.user)// 一对一关系 第一个参数是关联的实体类 第二个参数是关联的实体类的属性 第三个参数是级联操作     
    profile:Profile

}