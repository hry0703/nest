import 'reflect-metadata'
// 定义一个装饰器工厂函数 可以返回方法和类的装饰器
// 参数就是守卫
export function UseGuards(...guards: any[]) {
    // 返回一个装饰器函数
    return (target:Object | Function,propertyKey?:string,descriptor?:TypedPropertyDescriptor<any>)=>{
        if(descriptor){ // 如果是装饰方法 则给方法添加元数据guards
            Reflect.defineMetadata('guards',guards,descriptor.value)  // descriptor.value === index函数
        }else{ // 如果是装饰类  则给类添加元数据guards      
            Reflect.defineMetadata('guards',guards,target)
        }
    }
}