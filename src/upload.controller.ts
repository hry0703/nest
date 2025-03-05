import {BadRequestException, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UseGuards, UseInterceptors} from '@nestjs/common'
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { UploadedFile,UploadedFiles } from '@nestjs/common'
import { FileSizeValidationPipe } from './pipes/file-size-validation'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { NoFilesInterceptor } from '@nestjs/platform-express'
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
  @UseInterceptors(FileInterceptor('file')) 
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
  @UseInterceptors(FilesInterceptor('files',2)) 
  async parseFiles(@UploadedFiles(FileSizeValidationPipe) files:Express.Multer.File[]) {
    console.log('执行路由（file）处理程序',files)
    return {message:"upload success"}
  }



   // 多字段 多文件
  @Post('files-fields')
  @UseInterceptors(FileFieldsInterceptor([{name:'avatar',maxCount:1},{name:'background',maxCount:1}])) 
  async filesfields(@UploadedFiles() files:{avatar:Express.Multer.File,background:Express.Multer.File}) {
    console.log('执行路由（filefields）处理程序',files)
    return {message:"upload success"}
  }

   // 任意文件 字段名
//    {
//     fieldname: 'avatar',
//     originalname: 'package.json',
//     encoding: '7bit',
//     mimetype: 'application/json',
//     buffer: <Buffer 7b 0a 20 20 22 6e 61 6d 65 22 3a 20 22 63 6f 6e 66 69 67 22 2c 0a 20 20 22 76 65 72 73 69 6f 6e 22 3a 20 22 31 2e 30 2e 30 22 2c 0a 20 20 22 64 65 73 ... 437 more bytes>,
//     size: 487
//   }
  @Post('any-files') 
  @UseInterceptors(AnyFilesInterceptor()) 
  async anyFields(@UploadedFiles() files:Express.Multer.File[]) {
    console.log('执行路由（anyFields）处理程序',files)
    return {message:"upload success"}
  }


   @Post('no-files') // 要求http编码格式是form-data 但是不允许上传文件
  @UseInterceptors(NoFilesInterceptor()) 
  @UseInterceptors(FileInterceptor('file')) 
  async noFiles() {
    console.log('执行路由（noFiles）处理程序')
    return {message:"noFiles"}
  }

} 

