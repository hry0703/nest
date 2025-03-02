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