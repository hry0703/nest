import { Module } from "@nestjs/common";
import { LoggerClassService, LoggerService, UseFactory, UseValueService } from "./logger.service";

@Module({
     providers:[
        {
            provide:'SUFFIX',
            useValue:'suffix'
        },
        LoggerClassService, // 这样定义provider的话 token就是这个类本身，等价于下面这种写法 // 这种写法最多
        {
            provide:LoggerService,
            useClass:LoggerService // 说明提供的是一个类
        },
        
        {// 也是一种定义provider的方法
            provide:'StringToken',// 这是一个token 也称为标志 或者说令牌 也就是一个provider的名字
            useValue:new UseValueService('prefix')// 可以直接提供一个值
        },
        {
            provide:'FactoryToken',
            inject:['prefix1','SUFFIX'], // SUFFIX是个token这里期望实现传入的是 token为SUFFIX的provide的useValue 即suffix
            useFactory:(prefix1,prefix2)=>new UseFactory(prefix1,prefix2)
        }
    ],
    exports:[
        "SUFFIX",
        LoggerClassService,
        LoggerService,
        "StringToken",
        "FactoryToken"
    ]
})
export class LoggerModule {

}