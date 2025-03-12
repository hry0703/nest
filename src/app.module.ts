import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './logger/logger.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
const { combine, timestamp, printf } = winston.format;
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: combine(
            timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
            printf(({ level, message, timestamp, context }) => {
              return ` [Nest] ${(process as any).pid}  - ${timestamp} ${level}  [${context}]  ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    LoggerModule,
    SharedModule,
    AdminModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
