import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
@Injectable()
export class UtilityService {
  async hashPassword(password: string): Promise<string> {
    // 生成一个盐值 增强哈希的性能
    const salt = await bcrypt.genSalt();
    // 使用生成的盐值对密码进行哈希 返回哈希后的密码
    const hash = bcrypt.hash(password, salt);
    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    // 使用bcrypt库的compare方法 比较密码和哈希
    return bcrypt.compare(password, hash);
  }

  generateCaptcha(options) {
    return svgCaptcha.create(options);
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
