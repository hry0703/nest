import {  Module,Global } from "@nestjs/common";
import { CommonSerive } from "./common.service";


@Global()
@Module({
    providers:[CommonSerive],
    exports:[CommonSerive]
})
export class CommonModule {

}