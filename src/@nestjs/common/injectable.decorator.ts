import 'reflect-metadata'

// 定义模块装饰器
export function Injectable():ClassDecorator{
    return (target:Function)=>{
        // 给类的定义添加一个元数据，元数据名称为injectable，值为
        Reflect.defineMetadata('injectable',true,target)
    }
}