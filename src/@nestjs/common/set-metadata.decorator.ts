import 'reflect-metadata'
export function SetMetadata(metadataKey: string, metadataValue: any) {
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (descriptor) {
            Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
            // return descriptor;
        }
        Reflect.defineMetadata(metadataKey, metadataValue, target);
        // return target;
    };
}