import 'reflect-metadata'

export function Get(path:string=''):MethodDecorator{
    /**
     * 方法装饰器 
     * target 类原型  对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
     * propertyKey 方法名 index
     * descriptor index方法的属性描述符
     */
    return (target:any,propertyKey:string,descriptor:any)=>{
        // 给descriptor.value 也就是index函数添加元数据，path=path
        Reflect.defineMetadata('path',path,descriptor.value)
        // 给descriptor.value 也就是index函数添加元数据，method=GET
        Reflect.defineMetadata('method','GET',descriptor.value)
    }
}

export function Post(path:string=''):MethodDecorator{
    return (target:any,propertyKey:string,descriptor:any)=>{
        Reflect.defineMetadata('path',path,descriptor.value)
        Reflect.defineMetadata('method','POST',descriptor.value)
    }
}

export function Redirect(url:string='/',statusCode:number=302):MethodDecorator{
    return (target:any,propertyKey:string,descriptor:any)=>{
        Reflect.defineMetadata('redirectUrl',url,descriptor.value)
        Reflect.defineMetadata('redirectStatusCode',statusCode,descriptor.value)
    }
}

export function HttpCode(statusCode:number=200):MethodDecorator{
    return (target:any,propertyKey:string,descriptor:any)=>{
        Reflect.defineMetadata('statusCode',statusCode,descriptor.value)
    }
}

export function Header(name:string,value:string):MethodDecorator{
    return (target:any,propertyKey:string,descriptor:any)=>{
        const existingHeaders = Reflect.getMetadata('headers',descriptor.value)??[]
        existingHeaders.push({name,value})
        Reflect.defineMetadata('headers',existingHeaders,descriptor.value)
    }
}


