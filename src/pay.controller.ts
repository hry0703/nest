import {Controller, Get, UseGuards, UseInterceptors} from '@nestjs/common'
import { Logger1Interceptor } from './logger1.interceptor'
import { Logger2Interceptor } from './logger2.interceptor'

@Controller('pay')
export class PayController {

  @Get()
  @UseInterceptors(Logger1Interceptor)
  @UseInterceptors(Logger2Interceptor)
  async index() {
    console.log('pay')
    return 'pay results'
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
