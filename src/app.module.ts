import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PointModule } from './point/point.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UserModule, OrderModule, PointModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
