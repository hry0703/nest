import 'reflect-metadata'
// 模块的元数据
interface ModuleMetadata {
    controllers?:Function[],
    providers?:any[],
    exports?:any[],// 模块的导出 可以把自己的一部分providers导出给别的模块，别的模块只要导入了自己这个模块
    imports?:any[],// 导入的模块 可以导入别的模块，把别的模块的导出的providers给自己用
}
// 定义模块装饰器
export function Module(metadata:ModuleMetadata):ClassDecorator{
    return (target:Function)=>{
        // 当一个类使用Module装饰器的时候可以添加标识它是一个模块的元数据
        Reflect.defineMetadata('isModule',true,target)
        // 给模块类AppModule添加元数据 元数据的名字叫controllers 值是controllers数组[AppController]
        Reflect.defineMetadata('controllers',metadata.controllers,target)
        // 给模块类AppModule添加元数据 元数据的名字叫providers 值是providers数组[LoggerService]
        Reflect.defineMetadata('providers',metadata.providers,target)
        // 在类上保存exports
        Reflect.defineMetadata('exports',metadata.exports,target)
        // 在类上保存imports
        Reflect.defineMetadata('imports',metadata.imports,target)
    }
}

export function defineModule(module,targets=[]){
    // 遍历targets数组 为每个元素添加元数据，key是nestModule 值是对应的模块
    targets.forEach(target=>{
        Reflect.defineMetadata('NestModule',module,target)
    })
}