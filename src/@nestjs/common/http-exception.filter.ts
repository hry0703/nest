import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express'
/**
 * 过滤器处理类行为HttpException（及其子类）的异常。
 * 当异常是未识别的（既不是HttpException也不是继承自HttpException的子类）
 * 内置的异常过滤器会生成以下默认的JSON响应:{"statusCode":500,"message":"Internal server error"}
 */
export class GlobalHttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response =  ctx.getResponse<Response>()
        // 如果此响应已经发送给客户端了 再发生错误也不需要处理了
        if(response.headersSent){
            return 
        }
        if(exception instanceof HttpException){
            if(typeof exception.getResponse() === 'string'){
                const status:any = exception.getStatus()
                    return response.status(status).json({
                    statusCode:status,
                    message:exception.getResponse()
                })
            }else {
                response.status(exception.getStatus()).json(exception.getResponse())
            }
        } else {
            return response.status(500).json({
                statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
                error:exception.message,
                message:"Internal server error"
            })
        }
    }
    
} 