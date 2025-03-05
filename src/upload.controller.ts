import {BadRequestException, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UseGuards, UseInterceptors} from '@nestjs/common'
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadedFile } from '@nestjs/common'
import { FileSizeValidation } from './pipes/file-size-validation'
@Controller('upload')
export class UploadController {

  @Post('file')
  @UseInterceptors(FileInterceptor('file')) // FileInterceptor 作用是将文件信息保存到req.file中
  async file(@UploadedFile(FileSizeValidation) file:Express.Multer.File) {
    console.log('执行路由（file）处理程序',file)
    return {message:"upload success"}
  }


  @Post('parse-file')
  @UseInterceptors(FileInterceptor('file')) // FileInterceptor 作用是将文件信息保存到req.file中
  async parseFile(@UploadedFile(new ParseFilePipe({
    validators:[
        new MaxFileSizeValidator({maxSize:1024*30}),
        new FileTypeValidator({fileType:'image/jpeg'})
    ]
  })) file:Express.Multer.File) {
    console.log('执行路由（file）处理程序',file)
    return {message:"upload success"}
  }
} 

