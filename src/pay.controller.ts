import {BadRequestException, Controller, Get, UseGuards, UseInterceptors} from '@nestjs/common'
import { Logger1Interceptor } from './interceptors/logger1.interceptor'
import { Logger2Interceptor } from './interceptors/logger2.interceptor'
import { Logger3Interceptor } from './interceptors/logger3.interceptor'
import { Logger4Interceptor } from './interceptors/logger4.interceptor'
import { TransformInterceptor } from './interceptors/transform.interceptor'
import { ExcludeNullInterceptor } from './interceptors/excludeNull.interceptor'
import { ErrorsInterceptor } from './interceptors/error.interceptor'
import { CacheInterceptor } from './interceptors/catch.interceptor'
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'
@Controller('pay')
@UseInterceptors(Logger3Interceptor)
@UseInterceptors(Logger4Interceptor)
export class PayController {

  @Get()
  @UseInterceptors(Logger1Interceptor)
  @UseInterceptors(Logger2Interceptor)
  async index() {
    console.log('执行路由（pay）处理程序')
    return 'pay results'
  }

  @Get('data')
  @UseInterceptors(TransformInterceptor)
  async data() {
    console.log('执行路由（data）处理程序')
    return 'data results'
  }

  @Get('null')
  @UseInterceptors(ExcludeNullInterceptor)
  @UseInterceptors(TransformInterceptor)
  async null() {
    console.log('执行路由（null）处理程序')
    return  null
  }

  @Get('exception')
  @UseInterceptors(ErrorsInterceptor)
  async exception() {
     console.log('执行路由（exception）处理程序')
    throw new BadRequestException('some error')
  }


  @Get('user')
  @UseInterceptors(CacheInterceptor)
  async user() {
    console.log('执行路由（user）处理程序...')
    return {id:1,name:'user1'}
  }


  @Get('timeout')
  @UseInterceptors(TimeoutInterceptor)
  async timeout() {
    console.log('执行路由（timeout）处理程序...')
    return await new Promise(resolve=>{
      setTimeout(()=>{
        resolve('timeout-hah')
      },2000)
    })
  }
  
} 

/**
 * Logger2Interceptor->Logger1Interceptor->pay->Logger1Interceptor->Logger2Interceptor
 *  Before2
    Before1
    pay
    After1 1ms
    After2 3ms
 */
