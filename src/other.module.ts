import { Module } from "@nestjs/common";
import { OtherSerive } from "./other.service";



@Module({
    providers:[OtherSerive],
    exports:[OtherSerive]
})
export class OtherModule {

}