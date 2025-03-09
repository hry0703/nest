import { Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
@Entity()
@Tree("closure-table") // 闭包表
// @Tree("materialized-path") // 路径表达式
// @Tree("ancedced-table") // 连接表 不支持findTree等树形查询方法 也不常用
// @Tree("nested-set") // 嵌套集  一般不用
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:50})
    name: string;

    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;

}