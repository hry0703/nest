import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform<any,any> {
    constructor(private schema:ZodSchema<any>){}
    transform(value:any,metadata:ArgumentMetadata):any {
        try {
            // value是传进来的值 使用zodSchema进行解析和验证 如果通过则返回解析后的值
            return this.schema.parse(value)
        } catch (error) {
            // console.log('value',value);
            throw new BadRequestException('Validation failed')
        }
    }
}