import 'reflect-metadata'
import { ExceptionFilter } from '@nestjs/common'

export function UseFilters(...filters:any[]){
    return (target:object | Function,propertyKey?:string | Symbol,descriptor?:any)=>{
        if(descriptor){ // 如果是方法装饰器 则绑定到方法上 
            Reflect.defineMetadata('filters',filters,descriptor.value)
        }else { // 如果是类装饰器 则绑定到类上
            Reflect.defineMetadata('filters',filters,target)
        }
     
    }
}