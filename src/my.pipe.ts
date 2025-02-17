import { ArgumentMetadata, BadRequestException, Inject, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class MyPipe implements PipeTransform<any,any> {
    constructor(@Inject('PREFFIX') private prefix:string){
        console.log('MyPipe-PREFIX',this.prefix);
    }
    transform(value:any,metadata:ArgumentMetadata):any {
        return this.prefix + value
    }
}

