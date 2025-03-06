import 'reflect-metadata'
export function UseInterceptors(...interceptors){
    // console.log('interceptors',interceptors);
    return function(target:any,propertyKey?:string,descriptor?:PropertyDescriptor){
        if(descriptor){  // 如果是方法级别的拦截器
            const existingInterceptor = Reflect.getMetadata('interceptors',descriptor.value)??[]
            Reflect.defineMetadata('interceptors',[...existingInterceptor,...interceptors],descriptor.value)
        }else { // 如果是类级别的拦截器
            const existingInterceptor = Reflect.getMetadata('interceptors',target)??[]
            Reflect.defineMetadata('interceptors',[...existingInterceptor,...interceptors],target)
        }
    }
}