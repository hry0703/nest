import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import { UpdateSettingDto } from 'src/shared/dto/setting.dto';
import { SettingService } from 'src/shared/services/setting.service';

@Controller('admin/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @Render('settings')
  async getSetting() {
    let settings = await this.settingService.findFirst();
    if (!settings) {
      settings = await this.settingService.create({
        siteName: '默认网站',
        siteDescription: '默认网站描述',
        contactEmail: '默认联系邮箱',
      });
    }
    return { settings };
  }

  @Post()
  @Redirect('/admin')
  async updateSetting(@Body() updateSettingDto: UpdateSettingDto) {
    await this.settingService.update(updateSettingDto.id, updateSettingDto);
  }
}
