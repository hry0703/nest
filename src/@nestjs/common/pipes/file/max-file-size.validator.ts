import { isValid } from "zod";
import { FileValidator } from "./file-validator";
import { BadRequestException } from "@nestjs/common";

export class MaxFileSizeValidator extends FileValidator {
    isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
        if(file.size > this.validationOptions.maxSize){
            throw new BadRequestException(`Validation failed (expected size  is less tahn  ${(this.validationOptions.maxSize/1024/1024).toFixed(2)}M)`)  
        }
        return true
    }
}