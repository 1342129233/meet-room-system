import { Post, UseInterceptors, BadRequestException, UploadedFile, Controller } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { storage } from '@/utils';
import { ApiTags } from "@nestjs/swagger";
const path = require('path');

@ApiTags('上传模块')
@Controller('upload')
export class UploadController {
    // 头像上传(可以去专门写一个上传组件,key 存到这里)
    @Post('picture')
    @UseInterceptors(
        FileInterceptor('file', {
            dest: 'uploads',
            storage: storage, // 自定义存储
            // 限制图片的大小
            // limits: {
            // 	fileSize: 1024 * 1024 * 3
            // },
            // 文件的格式,这个和大小的限制在前端应该也是需要做拦截的
            fileFilter(req, file, callback) {
                const extname = path.extname(file.originalname);
                if(['.png', '.jpg', '.gif'].includes(extname)) {
                    callback(null, true);
                } else {
                    callback(new BadRequestException('只能上传图片'), false)
                }
            }
        })
    )
    async uploadFile(@UploadedFile() file: Express.Multer["File"]) {
        console.log('file', file);
        // 路径返回
        return file.path
    }
}