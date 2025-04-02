import { Body, Controller, Post, Res } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import { UserService } from 'src/shared/services/user.service';
import { UtilityService } from 'src/shared/services/utility.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from 'src/shared/services/configuration.service';
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
    private readonly jwtService: JwtService,
    private readonly configurationService: ConfigurationService,
  ) {}
  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    const { username, password } = body;
    const user = await this.validateUser(username, password);
    console.log('user', user);
    if (user) {
      const tokens = await this.createJwtTokens(user);
      return res.json({ success: true, ...tokens });
    }
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ success: false, message: '用户名或密码错误' });
  }
  async validateUser(username: string, password: string) {
    const existUser = await this.userService.findOne({
      where: { username },
      relations: ['roles', 'roles.accesses'],
    });
    console.log('existUser', existUser);
    if (
      existUser &&
      (await this.utilityService.comparePassword(password, existUser.password))
    ) {
      return existUser;
    }
    return null;
  }

  async createJwtTokens(user) {
    const access_token = this.jwtService.sign(
      {
        id: user.id,
        username: user.username,
      },
      {
        secret: this.configurationService.jwtSecret,
        expiresIn: '30m',
      },
    );
    return { access_token };
  }
}
