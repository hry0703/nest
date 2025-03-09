import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
// 使用Enetity装饰器来装饰实体类 name属性指定表名 不指定则默认是类名的小写
@Entity() // 一个实体对应数据库中的一张表
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text'})
    bio: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    // @OneToOne(()=>User,(user)=>user.profile,{
    //     cascade:true,
    //     onDelete:'RESTRICT',
    //     onUpdate:'RESTRICT'
    // })
    @JoinColumn()
    user:User

}

// user 1 profile userId = 1
// 主表    子表
// 主键    外键
// user id 主键  主键所在的表就是主表
// 这个字段是别的表的主键  这个字段就是外键   