
import 'reflect-metadata'
export class Reflector{
   get(metadataKey: string | symbol, target: Object | Function,key?:string | symbol){
      return key ?  Reflect.getMetadata(metadataKey,target,key) : Reflect.getMetadata(metadataKey,target)      
   }
}