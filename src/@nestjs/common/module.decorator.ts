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
        //就是把控制器的类和提供者的类和对应的模块进行了关联
        // 我得知道此控制器属于哪个模块
        defineModule(target,metadata.controllers)
        // 给模块类AppModule添加元数据 元数据的名字叫controllers 值是controllers数组[AppController]
        Reflect.defineMetadata('controllers',metadata.controllers,target)
        // 类上保存了一个providers数组 表示给此模块注入的provider供应者、
          // 我得知道此提供者属于哪个模块
        defineModule(target,(metadata.providers??[]).map(provider=>{
             /**
              *  // providers:[
                //     {
                //         provide:'SUFFIX',
                //         useValue:'suffix'
                //     },
                //     LoggerClassService, // 这样定义provider的话 token就是这个类本身，等价于下面这种写法 // 这种写法最多
                //     {
                //         provide:LoggerService,
                //         useClass:LoggerService // 说明提供的是一个类
                //     },
                    
                //     {// 也是一种定义provider的方法
                //         provide:'StringToken',// 这是一个token 也称为标志 或者说令牌 也就是一个provider的名字
                //         useValue:new UseValueService('prefix')// 可以直接提供一个值
                //     },
                //     {
                //         provide:'FactoryToken',
                //         inject:['prefix1','SUFFIX'], // SUFFIX是个token这里期望实现传入的是 token为SUFFIX的provide的useValue 即suffix
                //         useFactory:(prefix1,prefix2)=>new UseFactory(prefix1,prefix2)
                //     }
                // ]
              */
            //需要实例化的才需要添加module 方便依赖注入 比如上面只需要给 LoggerClassService ，LoggerService，添加 module
            return  provider instanceof Function ? provider : provider.useClass // provider.useClass 上添加module 方便APP_FILTER初始化全局过滤器时找到对应的模块 完成依赖注入
        }).filter(Boolean))
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
        Reflect.defineMetadata('module',module,target)
    })
}

export function Global(){
   return (target:Function)=>{
        Reflect.defineMetadata('global',true,target)
   }
}

export interface DynamicModule extends ModuleMetadata {
    module:Function,
}