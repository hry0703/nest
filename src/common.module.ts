import {  Module } from "@nestjs/common";
import { CommonSerive } from "./common.service";


// @Global()
@Module({
    providers:[CommonSerive],
    exports:[CommonSerive]
})
export class CommonModule {

}