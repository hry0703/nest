import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonSerive {
    log(message){
        console.log('CommonSerive',message);
    }
}