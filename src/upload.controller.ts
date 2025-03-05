import {BadRequestException, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UseGuards, UseInterceptors} from '@nestjs/common'
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { UploadedFile,UploadedFiles } from '@nestjs/common'
import { FileSizeValidationPipe } from './pipes/file-size-validation'
@Controller('upload')
export class UploadController {

  @Post('file')
  @UseInterceptors(FileInterceptor('file')) // FileInterceptor 作用是将文件信息保存到req.file中
  async file(@UploadedFile(FileSizeValidationPipe) file:Express.Multer.File) {
    console.log('执行路由（file）处理程序',file)
    return {message:"upload success"}
  }

  //  单字段 单文件
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

  // 单字段 多文件
  @Post('parse-files')
  @UseInterceptors(FilesInterceptor('files',2)) // FileInterceptor 作用是将文件信息保存到req.file中
  async parseFiles(@UploadedFiles(FileSizeValidationPipe) files:Express.Multer.File[]) {
    console.log('执行路由（file）处理程序',files)
    return {message:"upload success"}
  }



   // 多字段 单文件
  @Post('file-fields')
  @UseInterceptors(FilesInterceptor('files',2)) // FileInterceptor 作用是将文件信息保存到req.file中
  async filefields(@UploadedFiles(FileSizeValidationPipe) files:Express.Multer.File[]) {
    console.log('执行路由（file）处理程序',files)
    return {message:"upload success"}
  }

} 

