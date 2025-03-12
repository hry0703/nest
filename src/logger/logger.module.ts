import { Module } from "@nestjs/common";
import { MyLogger } from "src/my-logger";

@Module({
    providers:[
        {
            provide:'LOGGER_CONFIG',
            useValue:{enable:false}
        },
        MyLogger
    ]
})
export class LoggerModule {

}