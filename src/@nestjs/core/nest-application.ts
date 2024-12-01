// 导入 express 模块及相关类型
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Logger } from './logger';
import path  from  'path'
import { LoggerService, UseValueService } from '../../logger.service';
import { DESIGN_PARAMTYPES, INJECTED_TOKENS } from '../common';

export class NestApplication {
    // 定义一个私有的 express 应用实例
    private readonly app: Express = express();
    //在此处保存全部的providers key就是provider的token,值就是provider的实例或者说值
    private readonly providers = new Map();
    // 构造函数，接收一个模块参数
    constructor(protected readonly module: any) {
        this.app.use(express.json())  // 用来把json格式的请求体对象放在req.body上
        this.app.use(express.urlencoded({extended:true})) // 把form表单格式的请求体对象放在req.body上
        this.app.use((req,res,next)=>{
            req.user = {name:'admin',role:'admin'};
            next()
        })
        this.initProviders(); // 注入providers
    }
    // 初始化提供者
    initProviders(){
        // 获取模块导入的元数据
        const imports = Reflect.getMetadata('imports',this.module)??[];
        // 遍历所有导入的模块
        for (const importModule of imports) { 
            this.registerProvidersFromModule(importModule)
        }
        // 获取当前模块提供者的元数据
        const providers = Reflect.getMetadata('providers',this.module)??[] 
        // 遍历并添加每个提供者
        for (const provider of providers) {
            this.addProvider(provider)
        }
        console.log('this.providers',this.providers);
    }

    private registerProvidersFromModule(module){
        // 获取导入模块中的providers进行全量注册
        const importedProviders = Reflect.getMetadata('providers',module)??[]
        // 1 有可能导入的模块只导入了一部分 并没有全量导出，所以需要使用exports进行过滤
        const exports = Reflect.getMetadata('exports',module)??[]
        // 遍历导出exports数组
        for (const exportToken of exports) {
            // 2.exports里还有可能是module
            if(this.isModule(exportToken)){
                // 要执行递归操作
                this.registerProvidersFromModule(exportToken)
            }else {
                const provider = importedProviders.find(provider=>provider === exportToken || provider.provide === exportToken);
                if(provider){
                    this.addProvider(provider)
                }
            }
        }
    }

    private isModule(exportToken){
        return exportToken && exportToken instanceof Function && Reflect.getMetadata('isModule',exportToken,)
    }

    addProvider(provider){
        // 为了避免循环依赖 ，每次添加前做个判断 如果map中已经存在则直接返回
        const injectToken = provider.provide??provider
        if(this.providers.has(injectToken)) return 
        // 如果有provider的token 并且有useClass属性，说明提供的是一个类 需要实例化
        if(provider.provide && provider.useClass){
            // 获取这个类的定义 LoggerService
            const clazz = provider.useClass
            // 获取此类的参数 ['suffix']
            const dependencies = this.resolveDependencies(clazz)
            // 创建提供者类的实例
            const classInstance = new clazz(...dependencies);// 因为这个；类可能还会有依赖
            // 把provider的token和类的实例保存到this.providers里
            this.providers.set(provider.provide,classInstance)
        }else if(provider.provide && provider.useValue){
            // 提供的是一个值 则不需要容器帮助实例化了 直接使用此值注册就可以了
            this.providers.set(provider.provide,provider.useValue)
        }else if(provider.provide && provider.useFactory){
            const inject = provider.inject??[]// 获取要注入工厂函数的参数
            // 解析出参数的值
            // const injectedValues = inject.map(this.getProviderByToken) // this指向有问题
            // const injectedValues = inject.map((injectToken)=>this.getProviderByToken(injectToken)) // this指向问题 方法一
            const injectedValues = inject.map((this.getProviderByToken.bind(this))) // this指向问题 方法二 方法三可以将getProviderByToken定义改成箭头函数
            // 执行工厂方法 获取返回的值
            const value= provider.useFactory(...injectedValues)
            // 把token和值注册到map中
            this.providers.set(provider.provide,value) 
        }else {// 表示只提供了一个类 token是这个类 值是这个类的实例
            const dependencies = this.resolveDependencies(provider)
            const value = new provider(...dependencies)
            this.providers.set(provider,value)
        }
    }
    use(middleware){
        this.app.use(middleware)
    }

    private getProviderByToken(injectedToken){
       return this.providers.get(injectedToken)??injectedToken
    }

    private resolveDependencies(Clazz){
        // 取得注入的token
        const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS,Clazz)??[];
        // console.log('injectedTokens',injectedTokens);
        // 获取构造函数的参数类型
        const constructorParams = Reflect.getMetadata(DESIGN_PARAMTYPES,Clazz)??[];
        // console.log('constructorParams',constructorParams);
        return constructorParams.map((param,index)=>{
            // 把每个param中的token默认换成对应的provider值
            console.log(index,'injectedTokens',injectedTokens[index],'param',param);
            return this.getProviderByToken(injectedTokens[index]??param)
        })
    }
    // 定义 init 方法，初始化应用
    async init() {
        // 取出模块类里所有的控制器，然后做好路由配置
        let controllers = Reflect.getMetadata('controllers',this.module)||[]
        // // 记录日志：应用模块依赖已初始化
        Logger.log('AppModule dependencies initialized', 'InstanceLoader');

        // 路由映射的核心是知道 什么样的请求方法什么样的路径对应的哪个处理函数
        for (const Controller of controllers) {
            const dependencies = this.resolveDependencies(Controller)
            // 创建每个控制器类的实例
            const controller = new Controller(...dependencies)
            // 获取控制器的前缀
            let prefix = Reflect.getMetadata('prefix',Controller) || '/'
            // 开始解析路由
            Logger.log(`${Controller.name} {${prefix}}`, 'RouterResolver');
            const controllerPrototype = Reflect.getPrototypeOf(controller)
            for(const methodName of  Object.getOwnPropertyNames(controllerPrototype)){
                // 获取原型上的方法 methodName: index constructor
                const method = controllerPrototype[methodName];
                // 取得此函数上绑定的方法名的元数据
                const httpMethod = Reflect.getMetadata('method',method);
                // 取得此函数上绑定的路径的元数据
                const pathMetadata = Reflect.getMetadata('path',method);
                const redirectUrl = Reflect.getMetadata('redirectUrl',method);
                const redirectStatusCode = Reflect.getMetadata('redirectStatusCode',method);
                const statusCode = Reflect.getMetadata('statusCode',method);
                const headers = Reflect.getMetadata('headers',method)??[];
                // console.log('headers',headers);
                
                // 如果方法名不存在则不处理 
                if(!httpMethod) continue
                // 拼出来完整的路由路径
                const routePath=path.posix.join('/',prefix,pathMetadata)
                // console.log('methodName',method);
                // 配置路由，当客户端以httpMethod方法请求routePath路径的时候，会由对应的函数进行处理
                this.app[httpMethod.toLowerCase()](routePath,(req:ExpressRequest,res:ExpressResponse,next:NextFunction)=>{
                    const args = this.resolveParams(controller,methodName,req,res,next)
                    // 执行路由处理函数，获取返回值
                    const result =  method.call(controller,...args);
                    if(result?.url){
                        return  res.redirect(result.statusCode || 302 ,result.url)
                    }
                    if(statusCode){
                         res.statusCode = statusCode
                    }else if(httpMethod === 'post'){
                        res.statusCode = 201
                    }
                    
                    // 判断如果需要重定向 则直接重定向到指定的redirectUrl
                    if(redirectUrl){
                       return  res.redirect(redirectStatusCode || 302,redirectUrl,)
                    }
                    // 判断controller的methodName方法里有没有使用Response或者Res参数装饰器，如果用了则不发响应
                    const responseMeta = this.getResponseMetadata(controller,methodName);
                    // console.log('responseMeta',responseMeta);
                    // 没有注入Response或者Res参数装饰器 或者 注入了但是传递了passthrough参数  都会由Nest.js来返回响应
                    if(!responseMeta || responseMeta?.data?.passthrough){
                        headers.forEach(({name,value}) => {
                            res.setHeader(name,value)
                        });
                        // 把返回值序列化发回给客户端
                        res.send(result)
                    }
                })
                Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RouterResolver');
            }
        }
        Logger.log(`Nest application successfully started`, 'NestApplication');
        
    }
    
    private getResponseMetadata(instance:any,methodName:string){
          // 获取参数的元数据
        const paramsMetadata = Reflect.getMetadata('param',instance,methodName)??[];
         return paramsMetadata.filter(Boolean).find(paramMetadata=>['Res','Response','Next'].includes(paramMetadata.key))
    }

    private resolveParams(instance:any,methodName:string,req:ExpressRequest,res:ExpressResponse,next:NextFunction){
        // 获取参数的元数据
        const paramsMetadata = Reflect.getMetadata('param',instance,methodName)??[];
        // existingParameters [{ parameterIndex: 0, key: 'Req' },<1 empty item>,{ parameterIndex: 2, key: 'Request' }]
        return paramsMetadata.map(paramMetadata=>{
            const {key,data,factory} = paramMetadata;
            const ctx = { // 因为next不仅支持http 还支持graphql 微服务 websocket
                switchToHttp:()=>({
                    getRequest:()=>req,
                    getResponse:()=>res,
                    getNext:()=>next,
                })
            }
            switch (key) {
                case 'Req':
                case 'Request':
                    return req
                case 'Query':
                    return data? req.query[data] : req.query
                case 'Headers':
                    return data? req.headers[data] : req.headers
                case 'Session':
                    return data? req.session[data] : req.session
                case 'Ip':
                    return req.ip 
                case 'Param':
                    return data? req.params[data] : req.params
                case 'Body':
                    return data? req.body[data] : req.body
                case 'Res':
                case 'Response':
                    return res
                case 'Next':
                    return next
                case 'DecoratorFactory':
                    return factory(data,ctx)


                    
                default:
                    return null
            }
        })
      
    }

    // 定义 listen 方法，监听指定端口
    async listen(port: number) {
        // 初始化应用
        await this.init();
        // 监听指定端口
        this.app.listen(port, () => {
            // 记录日志：应用正在运行
            Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
        });
    }

    
}