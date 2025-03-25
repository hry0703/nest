import { Controller, Get, Render } from '@nestjs/common';
import { SettingService } from 'src/shared/services/setting.service';

@Controller('admin/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @Render('settings')
  async getSetting() {
    const setting = await this.settingService.getSetting();
    return {
      setting,
    };
  }
}
