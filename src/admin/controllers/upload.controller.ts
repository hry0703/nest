import {
  Controller,
  Get,
  Post,
  Render,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import * as sharp from 'sharp';
@Controller('admin')
export class UploadController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('upload', {
      storage: diskStorage({
        destination: './uploads', // 存储文件的路径
        filename: (req, file, callback) => {
          const filename = uuidv4() + path.extname(file.originalname);
          callback(null, filename); // 文件保存名称
        },
      }),
      fileFilter(req, file, callback) {
        // mimetype image/jpg image/jpeg image/png image/gif 不是xxx.jpg
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          callback(new Error('只允许上传图片'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // return {url:`/${file.filename}`}  // app.useStaticAssets(join(__dirname, '..', 'uploads')); main中设置了可以使用路径/文件名 访问uploads文件夹下的静态资源
    // return {url:`/uploads/${file.filename}`}  // ppModule中配置ServeStaticModule /uploads/xx 访问uploads文件夹下的静态资源
    // 设置压缩后的文件名 xxx.min.jpeg
    const filename = `${path.basename(file.filename, path.extname(file.filename))}.min.jpeg`;
    const outputFilePath = `./uploads/${filename}`;
    // 压缩图片
    await sharp(file.path)
      .resize(800, 600, {
        // 图片尺寸固定为 800 600
        fit: sharp.fit.inside, // 图片裁剪方式
        withoutEnlargement: true, // 防止图片被放大
      })
      .toFormat('jpeg') // 图片格式
      .jpeg({
        quality: 80, // 图片压缩质量
      })
      .toFile(outputFilePath); // 输出文件路径
    // fs.unlinkSync(file.path); // 删除原始文件
    return { url: `/uploads/${filename}` };
  }
}
