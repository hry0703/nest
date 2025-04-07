import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CategoryController } from './controllers/category.controller';
import { ArticleController } from './controllers/article.controller';
import { TagController } from './controllers/tag.controller';
@Module({
  controllers: [UserController, AuthController, CategoryController, ArticleController, TagController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class ApiModule {}
