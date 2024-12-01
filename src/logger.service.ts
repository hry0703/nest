import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class LoggerClassService {
    log(arg0: string) {
       console.log('LoggerClassService',arg0);
    }
}



@Injectable()
export class LoggerService {
    constructor(@Inject('SUFFIX') private suffix:string){
        console.log('LoggerService-suffix',this.suffix);
    }
    log(arg0: string) {
       console.log('LoggerService',arg0);
    }
}


@Injectable()
export class UseValueService {
    constructor(prefix:string){
        console.log('UseValueService-preifx',prefix);
    }
    log(arg0: string) {
       console.log('UseValueService',arg0);
    }
}

@Injectable()
export class UseFactory {
     constructor(prefix1:string,prefix2:string){
        console.log('UseFactory-preifx',prefix1,prefix2);
    }
    log(arg0: string) {
       console.log('UseFactory',arg0);
    }
}



