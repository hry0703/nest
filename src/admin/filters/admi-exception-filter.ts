import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
@Catch(HttpException)
export class AdminExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: any, host: ArgumentsHost) {
    // console.log('exception', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<Request>();
    let status = exception.getStatus();
    let message = exception.message;
    // 判断是否是验证管道抛出的异常
    if (exception instanceof BadRequestException) {
      const exceptionBody: any = exception.getResponse();
      if (typeof exceptionBody === 'object' && exceptionBody.message) {
        message = exceptionBody.message.join(',');
        status = exceptionBody.statusCode;
      }
    } else if (exception instanceof I18nValidationException) {
      //   console.log('exception', exception);
      const errors = exception.errors;
      message = errors
        .map((error) => this.formatErrorMessage(error, request.i18nLang))
        .join(';');
      status = 400;
    }
    response.status(status).render('error', {
      message: message,
    });
  }
  formatErrorMessage(error, lang) {
    const { property, value, constraints } = error;
    const constraintValues = Object.values(constraints);
    // constraintValues['validation.isNotEmpty|{"value":"","field":"password"}','validation.minLength|{"value":"","constraints":[6],"field":"password","length":6}'];
    const formattedMessages = constraintValues.map(
      (constraintValue: string) => {
        const [key, params] = constraintValue.split('|');
        if (params) {
          const parsedParams = JSON.parse(params);
          return this.i18n.translate(key, {
            lang,
            args: parsedParams,
          });
        }
      },
    );
    return `${property}:${value} ${formattedMessages.join(',')}`;
  }
}
