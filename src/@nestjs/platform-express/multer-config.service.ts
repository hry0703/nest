import { Inject, Injectable } from "@nestjs/common";
import { MulterModuleOptions } from "@nestjs/platform-express";
import { MULTER_MODULE_OPTIONS } from "./contants";
import multer from "multer";

@Injectable()
export class MulterConfigService {
    constructor(@Inject(MULTER_MODULE_OPTIONS) private options:MulterModuleOptions){}
    getMulterInstance(){
        return multer(this.options)
    }
}