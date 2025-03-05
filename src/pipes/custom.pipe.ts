import { PipeTransform, ArgumentMetadata, Injectable   } from "@nestjs/common";

@Injectable()
export class CustomPipe implements PipeTransform<string,any> {
    transform(value: string,metadata:ArgumentMetadata):any {
        // console.log(value);
        // console.log(JSON.stringify(metadata));
        return value
    }
    
}