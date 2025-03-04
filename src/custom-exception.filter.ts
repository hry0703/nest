import { ExceptionFilter,ArgumentsHost,HttpException, BadRequestException,Catch, RequestTimeoutException, Inject } from "@nestjs/common";
import { Response ,Request} from 'express'

/**
 * Catch(HttpException) 装饰器将所需的元数据绑定到异常过滤器，
 * 告诉 Nest 此特定过滤器正在查找 HttpException 类型的异常，而不是其他类型。@Catch() 装饰器可以接受单个参数或逗号分隔的列表。这使您可以一次为多种类型的异常设置过滤器。
 */
@Catch(BadRequestException,RequestTimeoutException,HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
    // constructor(@Inject('PREFFIX') private readonly preffix) {

    // }
    catch(exception: any, host: ArgumentsHost) {
        // console.log('preffix',this.preffix);
        const ctx = host.switchToHttp()
        const request =  ctx.getRequest<Request>()
        const response =  ctx.getResponse<Response>()
        const status = exception.getStatus()
        response.status(status).json({
            statusCode:status,
            message:exception.getResponse()?.message ? exception.getResponse()?.message  : exception.getResponse(),
            timestamp:new Date().toLocaleDateString(),
            path:request.url,
            method:request.method
        })
            
    }
    
} 