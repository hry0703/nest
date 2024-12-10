import { HttpStatus } from "@nestjs/common";

export class HttpException extends Error {
    private readonly response:string|object
    private readonly status:HttpStatus
    constructor(response:string|object,status:HttpStatus){
        super()
        this.response = response
        this.status = status
    }

    getResponse(){
       return this.response
    }
     getStatus(){
       return this.status
    }
}

export class BadRequestException  extends HttpException {
    constructor(message,error){
        super({message,error,statusCode:HttpStatus.BAD_REQUEST},HttpStatus.BAD_REQUEST)
    }
}

export class RequestTimeoutException  extends HttpException {
    constructor(message,error){
        super({message,error,statusCode:HttpStatus.REQUEST_TIMEOUT},HttpStatus.REQUEST_TIMEOUT)
    }
}


