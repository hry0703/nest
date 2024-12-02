import {Module, DynamicModule } from "@nestjs/common";
export interface Config {
    apiKey:string
}

@Module({
    providers:[
        {
            provide:'PREFIX',
            useValue:'prefix'
        }
    ],
    exports:['PREFIX']
})
export class DynamicConfigModule {
    static forRoot(apiKey:string):DynamicModule | Promise<DynamicModule> {
        // 根据参数动态创建providers
        const providers = [
            {
                provide:'CONFIG',
                useValue:{apiKey:apiKey}
            }
        ]
        const controllers = []
        return new Promise((resolve,reject)=>{
            setInterval(() => {
                resolve({
                module:DynamicConfigModule,
                providers,
                controllers,
                exports:providers.map(provider=>provider instanceof Function ? provider : provider.provide )
            })
            }, 3000);
        })
        //  return {
        //         module:DynamicConfigModule,
        //         providers,
        //         controllers,
        //         exports:providers.map(provider=>provider instanceof Function ? provider : provider.provide )
        //     }
     
    }
}