import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
@Catch(HttpException)
export class AdminExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('exception', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let message = exception.message;
    // 判断是否是验证管道抛出的异常
    if (exception instanceof BadRequestException) {
      const exceptionBody: any = exception.getResponse();
      if (typeof exceptionBody === 'object' && exceptionBody.message) {
        message = exceptionBody.message.join(',');
        status = exceptionBody.statusCode;
      }
    }
    response.status(status).render('error', {
      message: message,
    });
  }
}
