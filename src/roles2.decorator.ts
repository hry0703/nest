import {Reflector} from "@nestjs/core";
// 使用Reflector这个类的静态方法createDecorator创建一个装饰器  Role2
// 这个装饰器可以接受参数 比如@Role2('admin')
export const Roles2 = Reflector.createDecorator();