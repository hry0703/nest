import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class ClassValidationPipe implements PipeTransform<any,any> {
    async transform(value:any,metadata:ArgumentMetadata) {
        const {metatype} = metadata;
        if(!metatype || !this.needValidate(metatype)){  // 如果没有传类型 或者是基础类型 则直接返回value
            return value
        }
        // 此处的value只是个普通的对象
        const instance = plainToInstance(metatype,value);
        const errors = await validate(instance);
        if(errors.length){
            throw new BadRequestException('Validation failed')
        }
        return value
    }
    private needValidate(metatype:Function):boolean {
        const types:Function[] = [String,Boolean,Number,Array,Object]
        return !types.includes(metatype)      
    }
}
