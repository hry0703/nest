// 导入 express 模块及相关类型
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Logger } from './logger';
import path  from  'path'
import { RequestMethod} from '@nestjs/common';
import { DESIGN_PARAMTYPES, INJECTED_TOKENS } from '../common/constant';
import { defineModule, } from '../common/module.decorator';
import { APP_FILTER,APP_PIPE, Reflector } from '@nestjs/core';
import {GlobalHttpExceptionFilter} from '../common/http-exception.filter'
import { PipeTransform } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { ForbiddenException } from 'src/fobidden.exception';
import {APP_GUARD, APP_INTERCEPTOR, DECORATORS_FACTORY, FORBIDDEN_RESOURCE} from './constants'
import { from, mergeMap, Observable, of } from 'rxjs';
import { ArgumentsHost } from '@nestjs/common';
import { RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
export class NestApplication {
    // 定义一个私有的 express 应用实例
    private readonly app: Express = express();
    //在此处保存全部的providers的实例 key就是provider的token,值就是provider的实例或者说值
    private readonly providerInstances = new Map();
    //此处存放着全局可用的provider的token
    private readonly globalProviders = new Set();
    // 记录每个模块里有些哪些providers实例
    private readonly moduleProviders = new Map();
    // 记录所有的中间件 可能是中间件的类 可能是中间件的实例 也可能是个函数中间件
    private readonly middlewares = []
    // 记录所有要排除的路径
    private readonly excludedRoutes = []
    // 创建一个全局的异常过滤器
    private readonly defaultGlobalHttpExceptionFiler = new GlobalHttpExceptionFilter()
    // 这里存放着全局的异常过滤器
    private readonly globalHttpExceptionFiler = []
    // 这里存放所有的全局管道
    private readonly golbalPipes: PipeTransform[] = []
    // 这里存放所有的全局守卫
    private readonly golbalGuards= []
    // 这里存放所有的全局拦截器
    private readonly golbalInterceptors = []

    private readonly golbalProviderMap =  new Map([
        [APP_GUARD,new Map()], // 全局守卫
        [APP_PIPE,new Map()], // 全局管道
        [APP_FILTER,new Map()], // 全局过滤器
        [APP_INTERCEPTOR,new Map()], // 全局拦截器
    ])



    // 构造函数，接收一个模块参数
    constructor(protected readonly module: any) {
        this.app.use(express.json())  // 用来把json格式的请求体对象放在req.body上
        this.app.use(express.urlencoded({extended:true})) // 把form表单格式的请求体对象放在req.body上
    }

    useGlobalPipes(...pipes:PipeTransform[]){
        this.golbalPipes.push(...pipes)
    }
    useGlobalFilters(...filters){
        defineModule(this.module,filters.filter(filters=>filters instanceof Function))
        this.globalHttpExceptionFiler.push(...filters)
    }
    exclude(...routeInfos):this{
        console.log('exclude');
        this.excludedRoutes.push(...routeInfos.map(this.normalizeRouteInfo))
        return this
    }
    private async initMiddlewares(){
        // 调用配置中间件的方法 MiddlewareConsumer就是当前的NestApplication的实例
        this.module.prototype.configure(this);
    }
    apply(...midddleware){
        // 把接收到的中间件放到中间件数组中并且返回当前的实例
        this.middlewares.push(...midddleware)
        defineModule(this.module,this.middlewares)
        return this
    }
   
    private getMiddlewareInstance(middleware){
        if(middleware instanceof Function){
             const dependencies = this.resolveDependencies(middleware)
             // 怎么拿到的依赖？？
            //  console.log('dependencies',dependencies);
            return new middleware(...dependencies)
        }
        return middleware
    }
    isExcluded(reqPath:string,method: RequestMethod){
        // 遍历要排除的路径 看看哪个排除的路径和当前请求的路径和方法名匹配
        return this.excludedRoutes.some(routeInfo=>{
            const {routePath,routeMethod} = routeInfo;
            return reqPath === routePath && (routeMethod === RequestMethod.ALL|| routeMethod === method)
        })
    }
    forRoutes(...routes){
        // 遍历路径信息
        for(const route of routes){
            // 遍历中间件
            for(const middleware of this.middlewares){
                //把route格式化为标准对象 一个是路径一个是请求方法
                const {routePath,routeMethod}  = this.normalizeRouteInfo(route)
                // use方法的第一个参数就表示匹配路径 不匹配根本进不来
                this.app.use(routePath,(req,res,next)=>{
                    // 这里是请求匹配上才会执行的回调 异步的 此时excludedRoutes已初始化完成 所有中间件的forRoutes和exclude的调用顺序不会影响结果
                    // 如果当前的路径要排出掉 就不走当前的中间件了
                    if(this.isExcluded(req.originalUrl,req.method as unknown as RequestMethod)){ 
                        return next()
                    }
                    // 如果配置的方法名是all或者方法名完全相同 匹配
                    if(routeMethod === RequestMethod.ALL || routeMethod === req.method as unknown as RequestMethod){
                        // 此处的middleware 可能是个类或者实例或者函数
                        if('use' in middleware.prototype || 'use' in  middleware){
                            const middlewareInstance = this.getMiddlewareInstance(middleware)
                            middlewareInstance.use(req,res,next)
                        }else if(middleware instanceof Function) {
                            middleware(req,res,next)
                        }else {
                            next()
                        }
                    }else {
                        next()
                    }
                })
            }
        }
        /**
         * .apply(logger1)
        .forRoutes(AppController)

        
        .apply(logger2)
        .forRoutes(App2Controller)
         */
        // 为了实现 上面的效果（apply和forRoutes 成对存在）,每次执行forRoutes 返回前清除middlewares
        this.middlewares.length = 0
        return this 
    }
   
    private normalizeRouteInfo(route){
        let routePath = ''; // 转化路径
        let routeMethod = RequestMethod.ALL; // 默认是支持所有的方法
        if(typeof route  === 'string'){
            routePath = route
        }else if ('path' in route){
            routePath = route.path
            routeMethod = route.method??RequestMethod.ALL
        }else if (route instanceof Function){
            // 如果路由是个控制器则取其 前缀为routePath
            routePath = Reflect.getMetadata('prefix',route)
            routeMethod = route.method??RequestMethod.ALL
        }
        routePath = path.posix.join('/',routePath)
        return {routePath,routeMethod}
    }

    private addDefaultProviders(){
        // 注册一些系统内部默认的的provider
        this.addProvider(Reflector,module,true)
    }
    // 初始化提供者
    async initProviders(){
        this.addDefaultProviders()
        // 获取模块导入的元数据
        const imports = Reflect.getMetadata('imports',this.module)??[];
       
        // 遍历所有导入的模块
        for (const importModule of imports) { 
            let importedModule = importModule
            // 如果导入的是一个promise 说明是个异步的动态模块
             if(importModule instanceof Promise){
                importedModule = await importedModule
             }
            // 如果导入的模块有module属性 说明这是一个动态模块
            if('module' in importedModule){
                const {module,providers,controllers,exports} = importedModule;
                // console.log('d-module',importedModule);
                const oldProviders = Reflect.getMetadata('providers',module)
                const newProviders = [...(oldProviders??[]),...(providers??[])]
                defineModule(module,newProviders)
                const oldControllers = Reflect.getMetadata('controllers',module)
                const newControllers = [...(oldControllers??[]),...(controllers??[])]
                defineModule(module,newControllers)
                const oldExports = Reflect.getMetadata('exports',module)
                const newExports = [...(oldExports??[]),...(exports??[])]
                Reflect.defineMetadata('providers',newProviders,module)
                Reflect.defineMetadata('controllers',newControllers,module)
                Reflect.defineMetadata('exports',newExports,module)
                this.registerProvidersFromModule(module,this.module)
            }else {
                this.registerProvidersFromModule(importedModule,this.module)
            }
        }
        // 获取当前模块提供者的元数据
        const providers = Reflect.getMetadata('providers',this.module)??[] 
        // 遍历并添加每个提供者
        for (const provider of providers) {
            this.processProvider(provider,this.module)
        }
    }

    private processProvider(provider,module){
        // 如果这事一个全局的token对应的provider
        if(this.golbalProviderMap.has(provider.provide)){
           let instanceMap = this.golbalProviderMap.get(provider.provide)
           const { useClass } = provider
           if(!instanceMap.has(useClass)){
              const instance = new useClass(...this.resolveDependencies(useClass))
              instanceMap.set(useClass,instance)
           }
        }else {
            this.addProvider(provider,module,false)
        }
    }

    private registerProvidersFromModule(module,...parentModules){
        // 获取导入的是不是全局模块
        const global = Reflect.getMetadata('global',module)
        // 获取导入模块中的providers进行全量注册
        const importedProviders = Reflect.getMetadata('providers',module)??[]
        // 1 有可能导入的模块只导入了一部分 并没有全量导出，所以需要使用exports进行过滤
        const exports = Reflect.getMetadata('exports',module)??[]
        // 遍历导出exports数组
        for (const exportToken of exports) {
            // 2.exports里还有可能是module
            if(this.isModule(exportToken)){
                // 要执行递归操作
                this.registerProvidersFromModule(exportToken,module,...parentModules)
            }else {
                const provider = importedProviders.find(provider=>provider === exportToken || provider.provide === exportToken);
                if(provider){
                    [module,...parentModules].forEach(module=>{
                        this.addProvider(provider,module,global)
                    })
                }
            }
        }
        // 导入的模块中包含的controllers也需要处理
        this.initController(module);
    }

    private isModule(exportToken){
        return exportToken && exportToken instanceof Function && Reflect.getMetadata('isModule',exportToken,)
    }
    // 原来的provider都混在一起了 现在需要分开 每个模块都有自己的providers
    addProvider(provider,module,global=false){
        
        // providers在global为true的情况下为this.globalProviders Set
        // providers在global为false的情况下为this.module对应的providers Set
        const providers = global ? this.globalProviders : this.moduleProviders.get(module) || new Set();
        // 不需要判断 因为Set本身就可以去重，里面只会有不一样的值，两次添加相同的值只会添加一次
        // if(!this.moduleProviders.has(module)){
        if(!global){
            this.moduleProviders.set(module,providers)
        }
        // }
        // 获取要注册的provider的token
        const injectToken = provider.provide??provider
        // 如果实例池里已经有此token对应的实例了
        if(this.providerInstances.has(injectToken)) {
            // 则直接把此token放入到providers这个集合直接返回
            providers.add(injectToken);
            return 
        } 
      
        // 如果有provider的token 并且有useClass属性，说明提供的是一个类 需要实例化
        if(provider.provide && provider.useClass){
            // 获取这个类的定义 LoggerService
            const clazz = provider.useClass
            // 获取此类的参数 ['suffix']
            const dependencies = this.resolveDependencies(clazz)
            // 创建提供者类的实例
            const classInstance = new clazz(...dependencies);// 因为这个；类可能还会有依赖
            // 把provider的token和类的实例保存到this.providers里
            this.providerInstances.set(provider.provide,classInstance)
            providers.add(provider.provide)
        }else if(provider.provide && provider.useValue){
            // 提供的是一个值 则不需要容器帮助实例化了 直接使用此值注册就可以了
            this.providerInstances.set(provider.provide,provider.useValue)
             providers.add(provider.provide)
        }else if(provider.provide && provider.useFactory){
            const inject = provider.inject??[]// 获取要注入工厂函数的参数
            // 解析出参数的值
            // const injectedValues = inject.map(this.getProviderByToken) // this指向有问题
            // const injectedValues = inject.map((injectToken)=>this.getProviderByToken(injectToken)) // this指向问题 方法一
            const injectedValues = inject.map(injectToken=>this.getProviderByToken(injectToken,module)) // this指向问题 方法二 方法三可以将getProviderByToken定义改成箭头函数
            // 执行工厂方法 获取返回的值
            const value= provider.useFactory(...injectedValues)
            // 把token和值注册到map中
            this.providerInstances.set(provider.provide,value) 
             providers.add(provider.provide)
        }else {// 表示只提供了一个类 token是这个类 值是这个类的实例
            const dependencies = this.resolveDependencies(provider)            
            const value = new provider(...dependencies)
            this.providerInstances.set(provider,value)
            providers.add(provider)
        }
    }
    use(middleware){
        this.app.use(middleware)
    }

    private getProviderByToken(injectedToken,module){
        // 如何通过token在特定的模块下找对应的provider
        // 先找到此模块对应的token set，再判断此injectToken在不在此set中 如果存在 是可可以返回对应的provider实例
        if(this.moduleProviders.get(module)?.has(injectedToken) || this.globalProviders.has(injectedToken)){
            return this.providerInstances.get(injectedToken)
        }else {
            return null
        }
    }

    private resolveDependencies(Clazz){
        // 取得注入的token
        const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS,Clazz)??[];
        // console.log('injectedTokens',injectedTokens);
        // 获取构造函数的参数类型
        const constructorParams = Reflect.getMetadata(DESIGN_PARAMTYPES,Clazz)??[];
        // console.log('constructorParams',constructorParams);
        return constructorParams.map((param,index)=>{
            const module = Reflect.getMetadata('module',Clazz)
            // 把每个param中的token默认换成对应的provider值
            // console.log(index,'injectedTokens',injectedTokens[index],'param',param);
            return this.getProviderByToken(injectedTokens[index]??param,module)
        })
    }

    private getGuardsInstance(guard){
        if(guard instanceof Function){
             const dependencies = this.resolveDependencies(guard)
            return new guard(...dependencies)
        }
        return guard
    }
    async callGuards(guards:CanActivate[],ctx:ExecutionContext){
        for (const guard of guards) {
            const guardsInstance = this.getGuardsInstance(guard)
            const canActivate = await guardsInstance.canActivate(ctx)
            if(!canActivate){
                throw new ForbiddenException(FORBIDDEN_RESOURCE)
            }
        }
    }
    getInterceptorsInstance(interceptor){
        debugger
        if(typeof interceptor === 'function'){
            const dependencies = this.resolveDependencies(interceptor)
            return new interceptor(...dependencies)
        }
        return interceptor
    }
    callInterceptors(controller,method,interceptors,context,host,pipes){
        const nextFn = (i=0):Observable<any> =>{
            if(i >= interceptors.length){
                return from(this.resolveParams(controller,method.name,context,host,pipes)).pipe(mergeMap(args=>{
                    let result = method.call(controller,...args)
                    return result instanceof Promise ? from(result) : of(result)
                })) 
               
            }
            const handler = {
                handle:()=>nextFn(i+1)
            }
            const interceptorInstance = this.getInterceptorsInstance(interceptors[i])
            const result = interceptorInstance.intercept(context,handler)
            return from(result).pipe(mergeMap(res=> res instanceof Observable? res : of(res)))
        }
        return nextFn()
    }

    // 定义 init 方法，初始化应用
    async initController(module) {
        // 取出模块类里所有的控制器，然后做好路由配置
        let controllers = Reflect.getMetadata('controllers',module)||[]
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
            const controllerPrototype = Reflect.getPrototypeOf(controller); 
            // 获取控制器上绑定的异常过滤器数组
            const controllerFilters = Reflect.getMetadata('filters',Controller)??[];
            // 获取控制器上绑定的管道数组
            const controllerPipes = Reflect.getMetadata('pipes',Controller)??[];
            // 获取控制器上绑定的守卫数组
            const controllerGuards = Reflect.getMetadata('guards',Controller)??[];
            // 获取控制器上绑定的拦截器数组
            const controllerInterceptors = Reflect.getMetadata('interceptors',Controller)??[];
            defineModule(this.module,controllerFilters)
            for(const methodName of  Object.getOwnPropertyNames(controllerPrototype)){
                // 获取原型上的方法 methodName: index constructor
                const method = controllerPrototype[methodName];
                // console.log('methodName',methodName);
                // 取得此函数上绑定的方法名的元数据
                const httpMethod = Reflect.getMetadata('method',method);
                // 取得此函数上绑定的路径的元数据
                const pathMetadata = Reflect.getMetadata('path',method);
                const redirectUrl = Reflect.getMetadata('redirectUrl',method);
                const redirectStatusCode = Reflect.getMetadata('redirectStatusCode',method);
                const statusCode = Reflect.getMetadata('statusCode',method);
                const headers = Reflect.getMetadata('headers',method)??[];
                // 获取方法上绑定的异常过滤器数组
                const methodFilters = Reflect.getMetadata('filters',method)??[];
                // 获取方法上绑定的管道数组
                const methodPipes = Reflect.getMetadata('pipes',method)??[];
                // 获取方法上绑定的守卫数组
                const methodGuards = Reflect.getMetadata('guards',method)??[];
                // 获取方法上绑定的拦截器数组
                const methodInterceptors = Reflect.getMetadata('interceptors',method)??[];
        
                const pipes = [...controllerPipes,...methodPipes]
                const guards = [...this.golbalGuards,...controllerGuards,...methodGuards]
                const interceptors = [...this.golbalInterceptors,...controllerInterceptors,...methodInterceptors]
                defineModule(this.module,methodFilters)
                // console.log('headers',headers);
                // 如果方法名不存在则不处理 
                if(!httpMethod) continue
                // 拼出来完整的路由路径
                const routePath=path.posix.join('/',prefix,pathMetadata)
                // console.log('methodName',method);
                // 配置路由，当客户端以httpMethod方法请求routePath路径的时候，会由对应的函数进行处理
                this.app[httpMethod.toLowerCase()](routePath,async (req:ExpressRequest,res:ExpressResponse,next:NextFunction)=>{
                    const host = {
                        switchToHttp: () => ({
                            getRequest: <T>() => req as T,
                            getResponse: <T>() => res as T,
                            getNext: <T>() => next as T,
                        }),
                    }
                    const context:ExecutionContext = {
                        ...host,
                        getClass:()=>Controller,
                        getHandler:()=>method,    
                    }  as any as ExecutionContext
                    try {
                        await this.callGuards(guards,context)
                        this.callInterceptors(controller,method,interceptors,context,host,pipes).subscribe({
                            next:(result)=>{
                                // 执行路由处理函数，获取返回值
                                console.log('subscribe.result',result);
                                // const result = await method.call(controller,...args);
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
                            },
                            error:error=> this.callExceptionFilters(error,host,methodFilters,controllerFilters),
                            complete:()=>{
                                Logger.log(`Request processing completed`, 'RouterResolver');
                            }
                        })
                    } catch (error) {
                        await this.callExceptionFilters(error,host,methodFilters,controllerFilters)
                    }
                    
                })
                Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RouterResolver');
            }
        }
        Logger.log(`Nest application successfully started`, 'NestApplication');  
    }
 
    private getFilterInstance(filter){
        if(filter instanceof Function){
            const dependencies = this.resolveDependencies(filter)
            return new filter(...dependencies)
        }
        return filter
    }


    private callExceptionFilters(error,host,methodFilters,controllerFilters){
        console.error(error)
        //  按方法过滤器 控制器过滤器 用户配置全局过滤器 默认全局过滤器的顺序进行便利 找到第一个能处理这个错误的过滤器进行处理就可以了
        const allFilters = [...methodFilters,...controllerFilters,...this.globalHttpExceptionFiler,this.defaultGlobalHttpExceptionFiler];
        for(const filter of allFilters ){
            let filterInstance  = this.getFilterInstance(filter)
            // 取出此异常过滤器关心的异常 或者说要处理的异常
            const exceptions = Reflect.getMetadata('catch',filterInstance.constructor)??[];
            // 如果异常没有配置catch 或者说当前错误刚好就是配置的catch的exception的类型或者它的子类
            if(exceptions.length === 0 || exceptions.some(exception=> error instanceof exception)){
                filterInstance.catch(error,host)
                break;
            }
        }
    }
    
    private getResponseMetadata(instance:any,methodName:string){
          // 获取参数的元数据
        const paramsMetadata = Reflect.getMetadata('param',instance,methodName)??[];
         return paramsMetadata.filter(Boolean).find(paramMetadata=>['Res','Response','Next'].includes(paramMetadata.key))
    }

    private async resolveParams(instance:any,methodName:string,context,host,pipes:PipeTransform[]){
        const {getRequest,getResponse,getNext} = context.switchToHttp()
        const req = getRequest()
        const res = getResponse()
        const next = getNext()
        // 获取参数的元数据
        const paramsMetadata = Reflect.getMetadata('param',instance,methodName)??[];
        // existingParameters [{ parameterIndex: 0, key: 'Req' },<1 empty item>,{ parameterIndex: 2, key: 'Request' }]
        return Promise.all(paramsMetadata.map(async paramMetadata=>{
            const {key,data,factory,pipes:paramPipes,metatype } = paramMetadata;
            let value;
            switch (key) {
                case 'Req':
                case 'Request':
                    value = req
                    break 
                case 'Query':
                    value =  data? req.query[data] : req.query
                    break
                case 'Headers':
                    value =  data? req.headers[data] : req.headers
                    break
                case 'Session':
                    value =  data? (req as any).session[data] : (req as any).session
                    break
                case 'Ip':
                    value =  req.ip 
                    break
                case 'Param':
                    value =  data? req.params[data] : req.params
                    break
                case 'Body':
                    value =  data? req.body[data] : req.body
                    break
                case 'Res':
                case 'Response':
                    value =  res
                    break
                case 'Next':
                    value =  next
                    break
                case 'UploadedFile':
                    value =  req.file
                    break
                case 'UploadedFiles':
                    value =  req.files
                    break
                case DECORATORS_FACTORY:
                    value =  factory(data,host)
                    break
                default:
                    value =  null
                    break
            }
            for(const pipe of [...this.golbalPipes,...pipes,...paramPipes]){
                const pipeInstance = this.getPipeInstance(pipe)
                let type = key === DECORATORS_FACTORY ? 'custom' :key.toLowerCase()
                value = await pipeInstance.transform(value,{type,data,metatype})
            }
            return value
        }))
    }

    private getPipeInstance(pipe){
        if(typeof pipe === 'function'){
            const dependencies = this.resolveDependencies(pipe)
            return new pipe(...dependencies)
        }
        return pipe
    }
    async initGlobalFilters(){
        // 获取当前的模块的所有的providers
        const providers = Reflect.getMetadata('providers',this.module)??[];
        for (const provider of providers) {
            if(provider.provide === APP_FILTER){
               const providerInstance = this.getProviderByToken(APP_FILTER,this.module) 
               this.useGlobalFilters(providerInstance)
            }
        }
    }

    async initGlobalPipes(){
        // 获取当前的模块的所有的providers
        const providers = Reflect.getMetadata('providers',this.module)??[];
        for (const provider of providers) {
            if(provider.provide === APP_PIPE){
               const providerInstance = this.getProviderByToken(APP_PIPE,this.module) 
               this.useGlobalPipes(providerInstance)
            }
        }
    }

    async initGlobalGuards(){
        // 获取当前的模块的所有的providers
        const providers = Reflect.getMetadata('providers',this.module)||[];
        for (const provider of providers) {
            if(provider.provide === APP_GUARD){
               const providerInstance = this.getProviderByToken(APP_GUARD,this.module)
               this.useGlobalGuards(providerInstance)
            }
        }
    }


    async initGlobalInterceptors(){
        // 获取当前的模块的所有的providers
        const providers = Reflect.getMetadata('providers',this.module)||[];
        for (const provider of providers) {
            if(provider.provide === APP_INTERCEPTOR){
               const providerInstance = this.getProviderByToken(APP_INTERCEPTOR,this.module)
               this.useGlobalInterceptors(providerInstance)
            }
        }
    }

    useGlobalGuards(...guards){
        this.golbalGuards.push(...guards)
    }

    useGlobalInterceptors(...interceptors){
        this.golbalInterceptors.push(...interceptors)
    }

    private initGlobalProviders(){
       for (const [provide,instanceMap] of this.golbalProviderMap) {
         switch (provide) {
            case APP_FILTER:
                this.useGlobalFilters(...instanceMap.values())
                break;
            case APP_PIPE:
                this.useGlobalPipes(...instanceMap.values())
                break;
            case APP_GUARD:
                this.useGlobalGuards(...instanceMap.values())
                break;
            case APP_INTERCEPTOR:
                this.useGlobalInterceptors(...instanceMap.values())
                break;
            default:
                break;
         }
       }
    }

    // 定义 listen 方法，监听指定端口
    async listen(port: number) {
        await this.initProviders(); // 注入providers
        await this.initMiddlewares()// 初始化中间件配置
        // await this.initGlobalFilters()// 初始化全局过滤器
        // await this.initGlobalPipes()// 初始化全局管道
        // await this.initGlobalGuards()// 初始化全局守卫
        // await this.initGlobalInterceptors()// 初始化全局拦截器
        await this.initGlobalProviders()// 初始化全局providers
        await this.initController(this.module); // 这里初始化APPModule中的Controllers
        // 监听指定端口
        this.app.listen(port, () => {
            // 记录日志：应用正在运行
            Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
        });
    }

    
}