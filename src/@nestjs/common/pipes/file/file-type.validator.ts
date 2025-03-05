import { isValid } from "zod";
import { FileValidator } from "./file-validator";
import { BadRequestException } from "@nestjs/common";

export class FileTypeValidator extends FileValidator {
    isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
        if(file.mimetype !== this.validationOptions.fileType){
            throw new BadRequestException(`Validation failed (expected type is ${this.validationOptions.fileType})`)  
        }
        return true
    }
}