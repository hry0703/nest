import { Injectable,ConsoleLogger } from "@nestjs/common";

@Injectable()
export class ExtendedConsoleLogger extends ConsoleLogger{
    log(message: any,stack?:string,context?:string) {
        // console.log('ExtendedConsoleLogger.log',);
        super.log(message,stack,context)
    }
}