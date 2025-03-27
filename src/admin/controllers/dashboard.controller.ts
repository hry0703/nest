import { Controller, Get, Render, Sse } from '@nestjs/common';
import { interval } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from 'src/shared/services/dashboard.service';
import { SystemService } from 'src/shared/services/system.service';
import { WeatherService } from 'src/shared/services/weather.service';
@ApiTags('报表')
@Controller('admin')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly weatherService: WeatherService,
    private readonly systemService: SystemService,
  ) {}
  @Get()
  @Render('dashboard') // 使用模板渲染 路由函数中的返回是模版的数据源
  async dashboard() {
    return await this.dashboardService.getDashboardData();
  }

  @Get('weather')
  async getWeather() {
    const weather = await this.weatherService.getWeather();
    return weather;
  }

  @Sse('systemInfo')
  async getSystem() {
    return interval(3000).pipe(
      mergeMap(() => this.systemService.getSystemInfo()),
      map((systemInfo) => ({ data: systemInfo })),
    );
  }
}
