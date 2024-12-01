import { Injectable } from "@nestjs/common";
import { CommonSerive } from "./common.service";

@Injectable()
export class OtherSerive {
    constructor(private commonService:CommonSerive){}
    log(message){
        this.commonService.log(message)
        console.log('OtherSerive',message);
    }
}