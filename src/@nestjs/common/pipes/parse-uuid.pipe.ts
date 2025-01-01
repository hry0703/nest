import { BadRequestException, PipeTransform   } from "@nestjs/common";
import {validate} from "uuid"
export class ParseUUIDPipe implements PipeTransform<string,string> {
    transform(value: string):string {
       if(!validate(value)){
        throw new BadRequestException('Validation failed (uuid is expected)')
       }else {
        // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        return value
       }
    }
    
}