import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:50})
    name: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
    
    @ManyToMany(()=>User,user=>user.roles)
    users:User[]

}