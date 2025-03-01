import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor(error?:string){
        super('Forbidden',HttpStatus.FORBIDDEN)
    }
}