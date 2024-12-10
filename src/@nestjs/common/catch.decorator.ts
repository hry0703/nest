import 'reflect-metadata'

export function Catch(...exceptions):ClassDecorator{
    return (target:Function)=>{
        // 给控制器类添加prefix路径前缀的元数据
       Reflect.defineMetadata('catch',exceptions,target)
    }
}