import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ValidationError,validate } from "class-validator";

export class ValidationPipe implements PipeTransform<any,any> {
    async transform(value:any,metadata:ArgumentMetadata) {
        const {metatype} = metadata;
        if(!metatype || !this.needValidate(metatype)){  // 如果没有传类型 或者是基础类型 则直接返回value
            return value
        }
        // 此处的value只是个普通的对象
        const instance = plainToInstance(metatype,value);
        const errors = await validate(instance);
        if(errors.length){
            throw new BadRequestException(this.formatErrors(errors))
        }
        return value
    }
    private needValidate(metatype:Function):boolean {
        const types:Function[] = [String,Boolean,Number,Array,Object]
        return !types.includes(metatype)      
    }

    private formatErrors(errors:ValidationError[]){
        return errors.map(err=>{
            for(const property in err.constraints){
                return `${err.property} - ${err.constraints[property]}`
            }
        }).join(',')
    }
}
