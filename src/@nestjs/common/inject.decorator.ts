import 'reflect-metadata'
import { INJECTED_TOKENS } from '.';

// 定义参数装饰器
export function Inject(token:string):ParameterDecorator{
    // taget 类本身 prpertykey 方法的名称 parameterIndex参数的索引
    return (target:Object,prpertykey:string,parameterIndex:number )=>{
        // 取出被注入到此类的构造函数中的token
        const existingInjectedTokens = Reflect.getMetadata(INJECTED_TOKENS,target)??[]
        // [emptty,'StringToken']
        existingInjectedTokens[parameterIndex] = token;
        // 把数组保存在target的元数据上
        Reflect.defineMetadata(INJECTED_TOKENS,existingInjectedTokens,target)
    }
}