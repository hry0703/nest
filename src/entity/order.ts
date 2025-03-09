import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user";
@Entity() // 一个实体对应数据库中的一张表
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text'})
    product: string;

    @Column({type:'int'})
    amount: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(()=>User,(user)=>user.orders,)
    user:User
    

}