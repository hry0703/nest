
import { SetMetadata } from '@nestjs/common'
import 'reflect-metadata'
export class Reflector{
   get(metadataKey: string | symbol, target: Object | Function,key?:string | symbol){
      return key ?  Reflect.getMetadata(metadataKey,target,key) : Reflect.getMetadata(metadataKey,target)      
   }
   static createDecorator(){
    function decoratorFactory(metadataValue){
        // target=AccountController.prototype propertyKey='index' descriptor.value = index
        return (target:object|Function,propertyKey:string,descriptor:PropertyDescriptor) => {
            SetMetadata(decoratorFactory,metadataValue)(target,propertyKey,descriptor) // === Reflect.defineMetadata(decoratorFactory,metadataValue,descriptor.value) 
        }
    }
    return decoratorFactory
   }
}