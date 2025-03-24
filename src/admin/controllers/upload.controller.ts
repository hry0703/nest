import { Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4} from 'uuid'
@Controller('admin')
export class UploadController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('upload',{
        storage:diskStorage({
            destination:'./uploads', // 存储文件的路径
            filename:(req,file,callback)=>{
                const filename = uuidv4() + path.extname(file.originalname);
                callback(null,filename) // 文件保存名称
            }
        }),
        fileFilter(req, file, callback) {
            // mimetype image/jpg image/jpeg image/png image/gif 不是xxx.jpg
            if(!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)){
                callback(new Error('只允许上传图片'),false)
            }
            callback(null,true)
        },
    }))
    async uploadFile(@UploadedFile() file:Express.Multer.File  ) {    
        // return {url:`/${file.filename}`}  // app.useStaticAssets(join(__dirname, '..', 'uploads')); main中设置了可以使用路径/文件名 访问uploads文件夹下的静态资源
        return {url:`/uploads/${file.filename}`}  // ppModule中配置ServeStaticModule /uploads/xx 访问uploads文件夹下的静态资源
    } 
}
