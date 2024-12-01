import 'reflect-metadata'
// 其实可以给controller 传递路径前缀
// 前缀可以为空也可以写成空串，也可以写成一个非空串 也可以写成一个对象
interface ControllerOptions {
    prefix?:string
}

export function Controller():ClassDecorator
export function Controller(prefix:string):ClassDecorator
export function Controller(options:ControllerOptions):ClassDecorator
export function Controller(prefixOrOption?:string|ControllerOptions):ClassDecorator{
    let options:ControllerOptions={}
    if(typeof prefixOrOption === 'string'){
        options.prefix = prefixOrOption
    }else if(typeof prefixOrOption === 'object'){
        options = prefixOrOption
    }
    // 这是一个类装饰器 装饰的控制器这个类
    return (target:Function)=>{
        // 给控制器类添加prefix路径前缀的元数据
       Reflect.defineMetadata('prefix',options.prefix || '',target)
    }
}