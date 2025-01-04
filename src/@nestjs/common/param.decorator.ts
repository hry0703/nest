import { DECORATORS_FACTORY } from '@nestjs/core'
import 'reflect-metadata'
export const createParamDecorator = (keyOrFactory:string | Function)=>{
    // target 控制器原型 propertyKey 方法名handleRequest parameterIndex 先走1再走0
    return (data?:any,...pipes:any[])=>(target:any,propertykey:string,parameterIndex:number)=>{
        // 给控制器类的原型的propertyKey也就是handleRequest方法属性上添加元数据
        //属性名是params:handleRequest 值是一个数组，数组里放置数据表示哪个位置使用了哪个装饰器
        const existingParameters = Reflect.getMetadata('param',target,propertykey) || []
        if(keyOrFactory instanceof Function){
            // 如果传过来的是一个函数的话.存放参数索引 key定死为装饰器工程 factory就是用来取值的工厂
             existingParameters[parameterIndex] = {parameterIndex,key:DECORATORS_FACTORY,factory:keyOrFactory,data,pipes}
        }else {
            // existingParameters.push({parameterIndex,key}) 
            // existingParameters [ { parameterIndex: 1, key: 'Request' } ]
            // existingParameters [ { parameterIndex: 0, key: 'Req' } ]
            existingParameters[parameterIndex] = {parameterIndex,key:keyOrFactory,data,pipes}
            // console.log('existingParameters',existingParameters);
        }
        Reflect.defineMetadata('param',existingParameters,target,propertykey)
    }
}

export const Request = createParamDecorator('Request')
export const Req = createParamDecorator('Req')
export const Query = createParamDecorator('Query')
export const Headers = createParamDecorator('Headers')
export const Session = createParamDecorator('Session')
export const Ip = createParamDecorator('Ip')
export const Param = createParamDecorator('Param')
export const Body = createParamDecorator('Body')
export const Response = createParamDecorator('Response')
export const Res = createParamDecorator('Res')
export const Next = createParamDecorator('Next')


