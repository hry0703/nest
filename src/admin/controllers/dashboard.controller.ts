import { Controller, Get, Render } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
    @Get()
    @Render('dashboard') // 使用模板渲染 路由函数中的返回是模版的数据源
    dashboard() {
        return {title:"dashboard title"}
    }
}
