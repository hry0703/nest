import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingService {
  getSetting() {
    return {
      title: '博客设置',
      description: '博客描述',
      keywords: '博客关键词',
    };
  }
}
