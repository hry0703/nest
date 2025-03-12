import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('报表')
@Controller('dashboard')
export class DashboardController {
    @Get()
    @Render('dashboard') // 使用模板渲染 路由函数中的返回是模版的数据源
    dashboard() {
        return {title:"dashboard title"}
    }
}
