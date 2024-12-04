export interface MiddlewareConsumer {
    // 应用多个中间件
    apply(...middleware):this,
    // 配置应用此中间件的路由
    forRoutes(...routes)
}