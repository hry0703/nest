// import { ParseFileOptions } from "@nestjs/common";
// import { FileValidator } from "@nestjs/common";
import { ArgumentMetadata } from "@nestjs/common";
import { BadRequestException, Injectable, PipeTransform   } from "@nestjs/common";
import { FileValidator } from "./file-validator";

export interface ParseFileOptions {
    validators?:FileValidator[]
}


@Injectable()
export class ParseFilePipe implements PipeTransform {
    constructor(private options:ParseFileOptions) {

    }

    async transform(value: any,metadata:ArgumentMetadata) {
        if(!value) throw new BadRequestException('文件不存在')
        if(this.options.validators){
            for(const validator of this.options.validators){
                await validator.isValid(value)
            }
        }
        return value
    }
    
}