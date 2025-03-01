import 'reflect-metadata'
export function SetMetadata(metadataKey: any, metadataValue: any):any {
    return (target: object |Function, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>):any => {
        if (descriptor) {
            Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
            // return descriptor;
        }
        Reflect.defineMetadata(metadataKey, metadataValue, target);
        // return target;
    };
}