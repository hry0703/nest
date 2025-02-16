import {z} from 'zod'
// 定义一个名为createCatSchema的模式，用于验证cat对象的结构
export const createCatSchema = z.object({
    name:z.string(), // name属性必须是一个字符串
    age:z.number(), // age属性必须是一个数字
}).required()  // 要求cat对象必须包含name和age属性

// 通过zod的infer类型推断，将createCatSchema的类型推断为CreateCatDto类型
export type CreateCatDto = z.infer<typeof createCatSchema>
/**
 * type CreateCatDto = {
 *   name:string,
 *   age:number
 * }
 */