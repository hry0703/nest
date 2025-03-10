import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:50})
    name: string;

    @Column({length:50})
    email: string;

    @Column({type:'int'})
    age: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

}