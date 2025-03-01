import { ArgumentsHost } from "@nestjs/common";

export interface ExecutionContext extends ArgumentsHost {
    // 用于获取当前执行的类和方法 也就是控制器的类 或者控制器的方法
    getClass<T=any>(): T;
    // 用于获取路由处理函数，就是index函数
    getHandler(): Function;
}