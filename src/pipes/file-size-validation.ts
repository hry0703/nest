import { ArgumentMetadata, BadRequestException, Inject, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class FileSizeValidation implements PipeTransform<any,any> {
    transform(value:any,metadata:ArgumentMetadata):any {
        const maxSize = 1024 * 1024 * 10
        if(value.size > maxSize)  throw new BadRequestException('文件大小超过限制')
        return value
    }
}

