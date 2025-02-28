import { SetMetadata } from '@nestjs/common';
// 该函数接受任意数量的角色名 并且返回一个装饰器
export const Roles = (...roles: string[]) => {
    //调用setMatadata函数 将键roles和角色的数组作为原数据设置目标上
    return SetMetadata('roles', roles)
}